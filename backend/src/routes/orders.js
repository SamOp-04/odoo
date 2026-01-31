const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  markAsPickedUp,
  markAsReturned,
  cancelOrder
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrderById);
router.patch('/:id/pickup', authenticateToken, authorize('vendor', 'admin'), markAsPickedUp);
router.patch('/:id/return', authenticateToken, authorize('vendor', 'admin'), markAsReturned);
router.post('/:id/cancel', authenticateToken, cancelOrder);

module.exports = router;