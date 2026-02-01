const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  recordPayment,
  getPaymentsByOrder
} = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Razorpay routes
router.post('/razorpay/create-order', authenticateToken, createRazorpayOrder);
router.post('/razorpay/verify', authenticateToken, verifyRazorpayPayment);

// Legacy payment route
router.post('/', authenticateToken, recordPayment);
router.get('/order/:orderId', authenticateToken, getPaymentsByOrder);

module.exports = router;