const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  togglePublish,
  checkProductAvailability,
  uploadProductImages,
  deleteProductImage,
  replaceProductImages,
  setPrimaryImage
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validateProduct } = require('../middleware/validation');

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

// Basic product routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, authorize('vendor', 'admin'), validateProduct, createProduct);
router.put('/:id', authenticateToken, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', authenticateToken, authorize('vendor', 'admin'), deleteProduct);
router.patch('/:id/toggle-publish', authenticateToken, authorize('vendor', 'admin'), togglePublish);
router.post('/check-availability', checkProductAvailability);

// Image management routes
router.post(
  '/:id/images', 
  authenticateToken, 
  authorize('vendor', 'admin'), 
  upload.array('images', 10), // Allow up to 10 images
  uploadProductImages
);

router.delete(
  '/:id/images',
  authenticateToken,
  authorize('vendor', 'admin'),
  deleteProductImage
);

router.put(
  '/:id/images',
  authenticateToken,
  authorize('vendor', 'admin'),
  upload.array('images', 10),
  replaceProductImages
);

// Set primary/thumbnail image
router.patch(
  '/:id/primary-image',
  authenticateToken,
  authorize('vendor', 'admin'),
  setPrimaryImage
);

module.exports = router;