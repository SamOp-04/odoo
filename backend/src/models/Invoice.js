const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalOrder', required: true },
  invoice_number: { type: String, unique: true, required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  invoice_date: { type: Date, default: Date.now },
  due_date: Date,
  
  lines: [{
    description: String,
    quantity: Number,
    unit_price: Number,
    subtotal: Number,
    tax_rate: Number,
    tax_amount: Number,
    total: Number
  }],
  
  subtotal: Number,
  tax_rate: { type: Number, default: 18 },
  tax_amount: Number,
  total_amount: Number,
  amount_paid: { type: Number, default: 0 },
  amount_due: Number,
  
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  
  payment_method: String,
  gstin_customer: String,
  gstin_vendor: String,
  pdf_url: String
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);