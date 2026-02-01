const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const RentalOrder = require('../models/RentalOrder');
const { createNotification } = require('../services/notification');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', order_id, invoice_id } = req.body;

    // Generate short receipt (max 40 chars for Razorpay)
    const timestamp = Date.now().toString().slice(-10); // Last 10 digits
    const shortId = (order_id || invoice_id || '').toString().slice(-8); // Last 8 chars
    const receipt = `rcpt_${shortId}_${timestamp}`; // Max 26 chars

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt,
      notes: {
        order_id: order_id || '',
        invoice_id: invoice_id || '',
        customer_id: req.user.id
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Verify Razorpay Payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      invoice_id,
      amount
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

    // Payment verified, record it
    const payment = await Payment.create({
      invoice_id,
      order_id,
      customer_id: req.user.id,
      amount,
      payment_method: 'razorpay',
      payment_status: 'success',
      transaction_id: razorpay_payment_id,
      payment_date: new Date(),
      notes: `Razorpay payment - Order: ${razorpay_order_id}`
    });

    // Update invoice if exists
    if (invoice_id) {
      const invoice = await Invoice.findById(invoice_id);
      if (invoice) {
        invoice.amount_paid += amount;
        invoice.amount_due = invoice.total_amount - invoice.amount_paid;
        
        if (invoice.amount_due <= 0) {
          invoice.status = 'paid';
        }
        
        await invoice.save();
      }
    }

    // Update order if exists
    if (order_id) {
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
    }

    // Create notification
    await createNotification(
      req.user.id,
      'payment_success',
      'Payment Successful',
      `Payment of ₹${amount} received successfully`
    );

    res.json({
      success: true,
      message: 'Payment verified and recorded successfully',
      payment
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

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
  createRazorpayOrder,
  verifyRazorpayPayment,
  recordPayment,
  getPaymentsByOrder
};