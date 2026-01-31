const express = require('express');
const router = express.Router();
const {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  confirmQuotation
} = require('../controllers/quotationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getQuotations);
router.get('/:id', authenticateToken, getQuotationById);
router.post('/', authenticateToken, createQuotation);
router.put('/:id', authenticateToken, updateQuotation);
router.delete('/:id', authenticateToken, deleteQuotation);
router.post('/:id/confirm', authenticateToken, confirmQuotation);

module.exports = router;