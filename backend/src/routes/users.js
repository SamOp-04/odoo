const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', authenticateToken, authorize('admin'), getAllUsers);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;