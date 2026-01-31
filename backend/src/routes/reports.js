const express = require('express');
const router = express.Router();
const {
  getRevenueReport,
  getProductReport,
  getOrdersReport
} = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/revenue', authenticateToken, authorize('vendor', 'admin'), getRevenueReport);
router.get('/products', authenticateToken, authorize('vendor', 'admin'), getProductReport);
router.get('/orders', authenticateToken, getOrdersReport);

module.exports = router;