const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  order_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RentalOrder', 
    required: [true, 'Order ID is required']
  },
  invoice_number: { 
    type: String, 
    unique: true, 
    required: [true, 'Invoice number is required']
  },
  customer_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Customer ID is required']
  },
  vendor_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Vendor ID is required']
  },
  
  invoice_date: { 
    type: Date, 
    default: Date.now 
  },
  due_date: Date,
  
  lines: [{
    description: String,
    quantity: {
      type: Number,
      min: [0, 'Quantity cannot be negative']
    },
    unit_price: {
      type: Number,
      min: [0, 'Unit price cannot be negative']
    },
    subtotal: {
      type: Number,
      min: [0, 'Subtotal cannot be negative']
    },
    tax_rate: {
      type: Number,
      min: [0, 'Tax rate cannot be negative'],
      max: [100, 'Tax rate cannot exceed 100%']
    },
    tax_amount: {
      type: Number,
      min: [0, 'Tax amount cannot be negative']
    },
    total: {
      type: Number,
      min: [0, 'Total cannot be negative']
    }
  }],
  
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  tax_rate: { 
    type: Number, 
    default: 18,
    min: [0, 'Tax rate cannot be negative'],
    max: [100, 'Tax rate cannot exceed 100%']
  }, // GST %
  tax_amount: {
    type: Number,
    required: [true, 'Tax amount is required'],
    min: [0, 'Tax amount cannot be negative']
  },
  total_amount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  amount_paid: { 
    type: Number, 
    default: 0,
    min: [0, 'Amount paid cannot be negative']
  },
  amount_due: {
    type: Number,
    min: [0, 'Amount due cannot be negative']
  },
  
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  
  payment_method: String,
  gstin_customer: String,
  gstin_vendor: String,
  pdf_url: String // S3 URL after generation
}, { 
  timestamps: true 
});

// Indexes
invoiceSchema.index({ invoice_number: 1 });
invoiceSchema.index({ order_id: 1 });
invoiceSchema.index({ customer_id: 1 });
invoiceSchema.index({ vendor_id: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ due_date: 1 });

// Virtual to check if invoice is overdue
invoiceSchema.virtual('is_overdue').get(function() {
  if (this.status === 'paid' || this.status === 'cancelled') {
    return false;
  }
  return this.due_date && new Date() > this.due_date;
});

// Pre-save hook to calculate amount_due
invoiceSchema.pre('save', function(next) {
  this.amount_due = this.total_amount - this.amount_paid;
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);