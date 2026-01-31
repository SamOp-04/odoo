const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const RentalOrder = require('../models/RentalOrder');
const { createNotification } = require('../services/notification');

const recordPayment = async (req, res) => {
  try {
    const { invoice_id, order_id, amount, payment_method } = req.body;
    
    const payment = await Payment.create({
      invoice_id,
      order_id,
      customer_id: req.user.id,
      amount,
      payment_method: payment_method || 'cash',
      payment_status: 'success',
      transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      payment_date: new Date(),
      notes: 'Demo payment for hackathon'
    });
    
    const invoice = await Invoice.findById(invoice_id);
    if (invoice) {
      invoice.amount_paid += amount;
      invoice.amount_due = invoice.total_amount - invoice.amount_paid;
      
      if (invoice.amount_due <= 0) {
        invoice.status = 'paid';
      }
      
      await invoice.save();
    }
    
    const order = await RentalOrder.findById(order_id);
    if (order) {
      order.deposit_paid += amount;
      
      if (order.deposit_paid >= order.total_amount) {
        order.full_payment_made = true;
        order.payment_status = 'paid';
      } else {
        order.payment_status = 'partial';
      }
      
      await order.save();
    }
    
    await createNotification(
      req.user.id,
      'payment_success',
      'Payment Successful',
      `Payment of ₹${amount} received successfully`
    );
    
    res.json({
      success: true,
      message: 'Payment recorded successfully',
      payment
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaymentsByOrder = async (req, res) => {
  try {
    const payments = await Payment.find({ order_id: req.params.orderId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  recordPayment,
  getPaymentsByOrder
};