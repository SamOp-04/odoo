const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');

async function generateInvoicePDF(invoiceId) {
  try {
    const invoice = await Invoice.findById(invoiceId)
      .populate('customer_id')
      .populate('vendor_id');
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    
    doc.on('data', chunk => chunks.push(chunk));
    
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12);
    doc.text(`Invoice Number: ${invoice.invoice_number}`);
    doc.text(`Date: ${invoice.invoice_date.toLocaleDateString()}`);
    doc.moveDown();
    
    doc.text('From:', { underline: true });
    doc.text(invoice.vendor_id.company_name);
    doc.text(`GSTIN: ${invoice.gstin_vendor}`);
    doc.moveDown();
    
    doc.text('To:', { underline: true });
    doc.text(invoice.customer_id.company_name);
    doc.text(`GSTIN: ${invoice.gstin_customer}`);
    doc.moveDown();
    
    const tableTop = doc.y;
    doc.text('Description', 50, tableTop);
    doc.text('Qty', 250, tableTop);
    doc.text('Price', 320, tableTop);
    doc.text('Tax', 400, tableTop);
    doc.text('Total', 480, tableTop);
    doc.moveDown();
    
    let y = doc.y;
    invoice.lines.forEach(line => {
      doc.text(line.description, 50, y);
      doc.text(line.quantity.toString(), 250, y);
      doc.text(`₹${line.unit_price}`, 320, y);
      doc.text(`₹${line.tax_amount.toFixed(2)}`, 400, y);
      doc.text(`₹${line.total.toFixed(2)}`, 480, y);
      y += 20;
    });
    
    doc.moveDown(2);
    
    doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)}`, { align: 'right' });
    doc.text(`GST (${invoice.tax_rate}%): ₹${invoice.tax_amount.toFixed(2)}`, { align: 'right' });
    doc.fontSize(14).text(`Total: ₹${invoice.total_amount.toFixed(2)}`, { align: 'right', underline: true });
    
    doc.end();
    
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        } catch (error) {
          reject(error);
        }
      });
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

module.exports = { generateInvoicePDF };