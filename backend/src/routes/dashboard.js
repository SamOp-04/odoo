const express = require('express');
const router = express.Router();
const {
  getCustomerDashboard,
  getVendorDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/customer', authenticateToken, authorize('customer'), getCustomerDashboard);
router.get('/vendor', authenticateToken, authorize('vendor'), getVendorDashboard);
router.get('/admin', authenticateToken, authorize('admin'), getAdminDashboard);

module.exports = router;