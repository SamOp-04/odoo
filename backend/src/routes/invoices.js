const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  downloadInvoice
} = require('../controllers/invoiceController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getInvoices);
router.get('/:id', authenticateToken, getInvoiceById);
router.get('/:id/download', authenticateToken, downloadInvoice);

module.exports = router;