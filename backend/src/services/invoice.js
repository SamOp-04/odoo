const Invoice = require('../models/Invoice');
const RentalOrder = require('../models/RentalOrder');
const Settings = require('../models/Settings');

async function createInvoiceFromOrder(orderId, session = null) {
  try {
    const order = await RentalOrder.findById(orderId)
      .populate('customer_id')
      .populate('vendor_id')
      .populate('lines.product_id')
      .session(session);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    const gstSetting = await Settings.findOne({ key: 'gst_rate' });
    const gstRate = gstSetting?.value || 18;
    
    let subtotal = 0;
    const invoiceLines = [];
    
    for (const line of order.lines) {
      const lineSubtotal = line.subtotal || 0;
      const lineQuantity = line.quantity || 0;
      const lineUnitPrice = line.unit_price || 0;
      
      subtotal += lineSubtotal;
      
      const taxAmount = (lineSubtotal * gstRate) / 100;
      const total = lineSubtotal + taxAmount;
      
      invoiceLines.push({
        description: `Rental: ${line.product_name || 'Product'}`,
        quantity: lineQuantity,
        unit_price: lineUnitPrice,
        subtotal: lineSubtotal,
        tax_rate: gstRate,
        tax_amount: isNaN(taxAmount) ? 0 : taxAmount,
        total: isNaN(total) ? lineSubtotal : total
      });
    }
    
    const taxAmount = (subtotal * gstRate) / 100;
    const totalAmount = subtotal + taxAmount;
    
    // Ensure no NaN values
    const finalSubtotal = isNaN(subtotal) ? 0 : subtotal;
    const finalTaxAmount = isNaN(taxAmount) ? 0 : taxAmount;
    const finalTotalAmount = isNaN(totalAmount) ? finalSubtotal : totalAmount;
    
    const invoice = await Invoice.create([{
      order_id: orderId,
      invoice_number: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customer_id: order.customer_id._id,
      vendor_id: order.vendor_id._id,
      invoice_date: new Date(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lines: invoiceLines,
      subtotal: finalSubtotal,
      tax_rate: gstRate,
      tax_amount: finalTaxAmount,
      total_amount: finalTotalAmount,
      amount_paid: 0,
      amount_due: finalTotalAmount,
      status: 'draft',
      payment_method: null,
      gstin_customer: order.customer_id.gstin,
      gstin_vendor: order.vendor_id.gstin,
      pdf_url: null
    }], { session });
    
    return invoice[0];
    
  } catch (error) {
    console.error('Invoice creation error:', error);
    throw error;
  }
}

module.exports = { createInvoiceFromOrder };