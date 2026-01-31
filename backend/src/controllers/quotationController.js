const mongoose = require('mongoose');
const Quotation = require('../models/Quotation');
const RentalOrder = require('../models/RentalOrder');
const Reservation = require('../models/Reservation');
const Product = require('../models/Product');
const { checkAvailability } = require('../services/availability');
const { calculateRentalPrice } = require('../services/pricing');
const { createInvoiceFromOrder } = require('../services/invoice');
const { createNotification } = require('../services/notification');

const getQuotations = async (req, res) => {
  try {
    const filter = { customer_id: req.user.id };
    const quotations = await Quotation.find(filter).populate('lines.product_id');
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('lines.product_id');
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    if (quotation.customer_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createQuotation = async (req, res) => {
  try {
    const { lines, notes } = req.body;
    
    let totalAmount = 0;
    let depositAmount = 0;
    const processedLines = [];
    
    for (const line of lines) {
      const product = await Product.findById(line.product_id);
      if (!product) {
        return res.status(404).json({ error: `Product ${line.product_id} not found` });
      }
      
      const pricing = calculateRentalPrice(
        product,
        line.rental_start_date,
        line.rental_end_date,
        line.rental_duration_type
      );
      
      const lineTotal = pricing.subtotal * line.quantity;
      totalAmount += lineTotal;
      depositAmount += pricing.deposit * line.quantity;
      
      processedLines.push({
        product_id: line.product_id,
        variant_id: line.variant_id,
        quantity: line.quantity,
        rental_start_date: line.rental_start_date,
        rental_end_date: line.rental_end_date,
        rental_duration_type: line.rental_duration_type,
        rental_duration_value: pricing.duration,
        unit_price: pricing.unitPrice,
        subtotal: lineTotal
      });
    }
    
    const quotation = await Quotation.create({
      customer_id: req.user.id,
      quotation_number: `QUOT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      lines: processedLines,
      total_amount: totalAmount,
      deposit_amount: depositAmount,
      notes,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    if (quotation.customer_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (quotation.status !== 'draft') {
      return res.status(400).json({ error: 'Can only update draft quotations' });
    }
    
    Object.assign(quotation, req.body);
    await quotation.save();
    
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    
    if (quotation.customer_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (quotation.status !== 'draft') {
      return res.status(400).json({ error: 'Can only delete draft quotations' });
    }
    
    await quotation.deleteOne();
    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const confirmQuotation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('lines.product_id')
      .session(session);
    
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    
    if (quotation.customer_id.toString() !== req.user.id) {
      throw new Error('Unauthorized');
    }
    
    if (quotation.status !== 'draft') {
      throw new Error('Quotation already confirmed');
    }
    
    for (const line of quotation.lines) {
      const availability = await checkAvailability(
        line.product_id._id,
        line.variant_id,
        line.quantity,
        line.rental_start_date,
        line.rental_end_date
      );
      
      if (!availability.available) {
        throw new Error(`Product ${line.product_id.name} not available`);
      }
    }
    
    const vendorId = quotation.lines[0].product_id.vendor_id;
    
    // Create order with product images snapshot
    const orderLines = quotation.lines.map(line => {
      const product = line.product_id;
      return {
        product_id: product._id,
        product_name: product.name,
        variant_id: line.variant_id,
        quantity: line.quantity,
        rental_start_date: line.rental_start_date,
        rental_end_date: line.rental_end_date,
        unit_price: line.unit_price,
        subtotal: line.subtotal,
        // Capture product images at time of order
        product_image: product.images && product.images.length > 0 ? product.images[0] : null,
        product_images: product.images || []
      };
    });
    
    const order = await RentalOrder.create([{
      quotation_id: req.params.id,
      customer_id: quotation.customer_id,
      vendor_id: vendorId,
      order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'confirmed',
      lines: orderLines,
      total_amount: quotation.total_amount,
      deposit_paid: 0,
      full_payment_made: false,
      payment_status: 'pending',
      return_date: quotation.lines[0].rental_end_date
    }], { session });
    
    const reservations = quotation.lines.map(line => ({
      product_id: line.product_id._id,
      variant_id: line.variant_id || null,
      order_id: order[0]._id,
      quantity_reserved: line.quantity,
      start_date: line.rental_start_date,
      end_date: line.rental_end_date,
      status: 'active'
    }));
    
    await Reservation.insertMany(reservations, { session });
    
    quotation.status = 'confirmed';
    await quotation.save({ session });
    
    await createInvoiceFromOrder(order[0]._id, session);
    
    await createNotification(
      req.user.id,
      'order_confirmed',
      'Order Confirmed',
      `Your rental order ${order[0].order_number} has been confirmed`
    );
    
    await session.commitTransaction();
    
    res.json({ message: 'Quotation confirmed', order: order[0] });
    
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

module.exports = {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  confirmQuotation
};