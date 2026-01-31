const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  togglePublish,
  checkProductAvailability
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validateProduct } = require('../middleware/validation');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, authorize('vendor', 'admin'), validateProduct, createProduct);
router.put('/:id', authenticateToken, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', authenticateToken, authorize('vendor', 'admin'), deleteProduct);
router.patch('/:id/toggle-publish', authenticateToken, authorize('vendor', 'admin'), togglePublish);
router.post('/check-availability', checkProductAvailability);

module.exports = router;