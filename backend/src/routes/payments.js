const express = require('express');
const router = express.Router();
const {
  recordPayment,
  getPaymentsByOrder
} = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, recordPayment);
router.get('/order/:orderId', authenticateToken, getPaymentsByOrder);

module.exports = router;