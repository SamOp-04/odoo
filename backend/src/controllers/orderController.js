const mongoose = require('mongoose');
const RentalOrder = require('../models/RentalOrder');
const Reservation = require('../models/Reservation');
const PickupDocument = require('../models/PickupDocument');
const ReturnDocument = require('../models/ReturnDocument');
const { calculateLateFee } = require('../services/pricing');
const { createNotification } = require('../services/notification');
const { uploadMultipleImages, deleteMultipleImages } = require('../services/s3');

const getOrders = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'customer') {
      filter.customer_id = req.user.id;
    } else if (req.user.role === 'vendor') {
      filter.vendor_id = req.user.id;
    }
    
    const orders = await RentalOrder.find(filter)
      .populate('customer_id', 'name email company_name')
      .populate('vendor_id', 'name email company_name')
      .populate('lines.product_id');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await RentalOrder.findById(req.params.id)
      .populate('customer_id')
      .populate('vendor_id')
      .populate('lines.product_id');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (req.user.role === 'customer' && order.customer_id._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (req.user.role === 'vendor' && order.vendor_id._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { vendor_id, lines, delivery_method, delivery_address, notes } = req.body;
    
    if (!lines || lines.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item' });
    }
    
    let totalAmount = 0;
    let depositAmount = 0;
    const processedLines = [];
    
    // Process each line and fetch product details
    for (const line of lines) {
      const Product = require('../models/Product');
      const product = await Product.findById(line.product_id);
      
      if (!product) {
        return res.status(404).json({ error: `Product ${line.product_id} not found` });
      }
      
      const lineTotal = line.subtotal || (line.unit_price * line.quantity);
      totalAmount += lineTotal;
      
      // Calculate deposit (assuming security_deposit from product)
      const depositPerItem = product.security_deposit || 0;
      depositAmount += depositPerItem * line.quantity;
      
      processedLines.push({
        product_id: line.product_id,
        product_name: product.name,
        variant_id: line.variant_id,
        quantity: line.quantity,
        rental_start_date: line.rental_start_date,
        rental_end_date: line.rental_end_date,
        unit_price: line.unit_price,
        subtotal: lineTotal,
        product_image: product.images && product.images.length > 0 ? product.images[0] : null,
        product_images: product.images || []
      });
    }
    
    // Generate order number
    const orderNumber = `SO${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Create the order
    const order = await RentalOrder.create({
      customer_id: req.user.id,
      vendor_id: vendor_id,
      order_number: orderNumber,
      status: 'confirmed',
      lines: processedLines,
      total_amount: totalAmount,
      deposit_paid: depositAmount,
      full_payment_made: true,
      payment_status: 'paid',
      notes: notes || ''
    });
    
    // Create invoice for the order
    const Invoice = require('../models/Invoice');
    const invoiceNumber = `INV${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const taxRate = 0; // No tax for now, can be changed later
    const invoiceSubtotal = totalAmount;
    const invoiceTaxAmount = invoiceSubtotal * (taxRate / 100);
    const invoiceTotalAmount = invoiceSubtotal + invoiceTaxAmount + depositAmount;
    
    await Invoice.create({
      invoice_number: invoiceNumber,
      order_id: order._id,
      customer_id: req.user.id,
      vendor_id: vendor_id,
      invoice_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'paid',
      lines: processedLines.map(line => {
        const lineSubtotal = line.subtotal || 0;
        const lineTaxAmount = lineSubtotal * (taxRate / 100);
        const lineTotal = lineSubtotal + lineTaxAmount;
        
        return {
          description: line.product_name,
          quantity: line.quantity || 0,
          unit_price: line.unit_price || 0,
          subtotal: lineSubtotal,
          tax_rate: taxRate,
          tax_amount: lineTaxAmount,
          total: lineTotal
        };
      }),
      subtotal: invoiceSubtotal,
      tax_rate: taxRate,
      tax_amount: invoiceTaxAmount,
      total_amount: invoiceTotalAmount,
      amount_paid: invoiceTotalAmount,
      amount_due: 0
    });
    
    // Create notification for vendor
    await createNotification(
      vendor_id,
      'new_order',
      'New Order Received',
      `You have received a new order ${orderNumber}`
    );
    
    // Populate and return the order
    const populatedOrder = await RentalOrder.findById(order._id)
      .populate('customer_id', 'name email')
      .populate('vendor_id', 'name email')
      .populate('lines.product_id');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};

const markAsPickedUp = async (req, res) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (order.status !== 'confirmed') {
      return res.status(400).json({ error: 'Order must be confirmed first' });
    }
    
    // Handle pickup images if provided
    let pickupImageUrls = [];
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        buffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype
      }));
      
      pickupImageUrls = await uploadMultipleImages(images);
      order.pickup_images = pickupImageUrls;
    }
    
    order.status = 'with_customer';
    order.pickup_date = new Date();
    await order.save();
    
    await PickupDocument.create({
      order_id: req.params.id,
      pickup_number: `PICKUP-${Date.now()}`,
      pickup_date: new Date(),
      status: 'completed',
      verified_by: req.user.id
    });
    
    await createNotification(
      order.customer_id,
      'pickup_reminder',
      'Order Picked Up',
      `Your order ${order.order_number} has been picked up`
    );
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsReturned = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { actualReturnDate, conditionNotes } = req.body;
    
    const order = await RentalOrder.findById(req.params.id).session(session);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (order.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    if (order.status !== 'with_customer') {
      throw new Error('Order not with customer');
    }
    
    // Handle return images if provided
    let returnImageUrls = [];
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        buffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype
      }));
      
      returnImageUrls = await uploadMultipleImages(images);
      order.return_images = returnImageUrls;
    }
    
    const lateFee = calculateLateFee(order, { late_fee_per_day: 100 });
    
    order.status = 'returned';
    order.actual_return_date = actualReturnDate || new Date();
    order.late_fee = lateFee;
    await order.save({ session });
    
    await Reservation.updateMany(
      { order_id: req.params.id },
      { status: 'completed' },
      { session }
    );
    
    await ReturnDocument.create([{
      order_id: req.params.id,
      return_number: `RETURN-${Date.now()}`,
      expected_return_date: order.return_date,
      actual_return_date: actualReturnDate || new Date(),
      condition_notes: conditionNotes || 'Good condition',
      late_fee: lateFee,
      status: 'completed',
      verified_by: req.user.id
    }], { session });
    
    await createNotification(
      order.customer_id,
      'late_return',
      'Order Returned',
      `Your order ${order.order_number} has been returned. Late fee: ₹${lateFee}`
    );
    
    await session.commitTransaction();
    res.json(order);
    
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const order = await RentalOrder.findById(req.params.id).session(session);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (order.customer_id.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new Error('Access denied');
    }
    
    if (order.status !== 'confirmed') {
      throw new Error('Can only cancel confirmed orders');
    }
    
    order.status = 'cancelled';
    await order.save({ session });
    
    await Reservation.updateMany(
      { order_id: req.params.id },
      { status: 'cancelled' },
      { session }
    );
    
    await session.commitTransaction();
    res.json({ message: 'Order cancelled successfully', order });
    
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

/**
 * Upload additional pickup images to an order
 */
const uploadPickupImages = async (req, res) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }
    
    const images = req.files.map(file => ({
      buffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype
    }));
    
    const imageUrls = await uploadMultipleImages(images);
    
    order.pickup_images = [...(order.pickup_images || []), ...imageUrls];
    await order.save();
    
    res.json({
      message: 'Pickup images uploaded successfully',
      images: imageUrls,
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload additional return images to an order
 */
const uploadReturnImages = async (req, res) => {
  try {
    const order = await RentalOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }
    
    const images = req.files.map(file => ({
      buffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype
    }));
    
    const imageUrls = await uploadMultipleImages(images);
    
    order.return_images = [...(order.return_images || []), ...imageUrls];
    await order.save();
    
    res.json({
      message: 'Return images uploaded successfully',
      images: imageUrls,
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  markAsPickedUp,
  markAsReturned,
  cancelOrder,
  uploadPickupImages,
  uploadReturnImages
};