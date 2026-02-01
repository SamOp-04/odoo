const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getOrders,
  getOrderById,
  createOrder,
  markAsPickedUp,
  markAsReturned,
  cancelOrder,
  uploadPickupImages,
  uploadReturnImages
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});

// Basic order routes
router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/', authenticateToken, authorize('customer', 'admin'), createOrder);

// Pickup/return with optional image upload
router.patch(
  '/:id/pickup', 
  authenticateToken, 
  authorize('vendor', 'admin'),
  upload.array('images', 10),
  markAsPickedUp
);

router.patch(
  '/:id/return', 
  authenticateToken, 
  authorize('vendor', 'admin'),
  upload.array('images', 10),
  markAsReturned
);

router.post('/:id/cancel', authenticateToken, cancelOrder);

// Additional image upload routes
router.post(
  '/:id/pickup-images',
  authenticateToken,
  authorize('vendor', 'admin'),
  upload.array('images', 10),
  uploadPickupImages
);

router.post(
  '/:id/return-images',
  authenticateToken,
  authorize('vendor', 'admin'),
  upload.array('images', 10),
  uploadReturnImages
);

module.exports = router;