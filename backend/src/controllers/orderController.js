const mongoose = require('mongoose');
const RentalOrder = require('../models/RentalOrder');
const Reservation = require('../models/Reservation');
const PickupDocument = require('../models/PickupDocument');
const ReturnDocument = require('../models/ReturnDocument');
const { calculateLateFee } = require('../services/pricing');
const { createNotification } = require('../services/notification');

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

module.exports = {
  getOrders,
  getOrderById,
  markAsPickedUp,
  markAsReturned,
  cancelOrder
};