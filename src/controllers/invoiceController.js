const Invoice = require('../models/Invoice');
const { generateInvoicePDF } = require('../services/pdf');
const { uploadPDFToS3 } = require('../services/s3');

const getInvoices = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'customer') {
      filter.customer_id = req.user.id;
    } else if (req.user.role === 'vendor') {
      filter.vendor_id = req.user.id;
    }
    
    const invoices = await Invoice.find(filter)
      .populate('customer_id', 'name email company_name')
      .populate('vendor_id', 'name email company_name')
      .populate('order_id');
    
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer_id')
      .populate('vendor_id')
      .populate('order_id');
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (req.user.role === 'customer' && invoice.customer_id._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (req.user.role === 'vendor' && invoice.vendor_id._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (req.user.role === 'customer' && invoice.customer_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (req.user.role === 'vendor' && invoice.vendor_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (invoice.pdf_url) {
      return res.json({ pdf_url: invoice.pdf_url });
    }
    
    const pdfBuffer = await generateInvoicePDF(req.params.id);
    const fileName = `${invoice.invoice_number}.pdf`;
    
    const s3Url = await uploadPDFToS3(pdfBuffer, fileName);
    
    invoice.pdf_url = s3Url;
    await invoice.save();
    
    res.json({ pdf_url: s3Url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  downloadInvoice
};