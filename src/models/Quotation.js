const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  customer_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Customer ID is required']
  },
  quotation_number: { 
    type: String, 
    unique: true, 
    required: [true, 'Quotation number is required']
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'confirmed', 'expired'], 
    default: 'draft' 
  },
  
  lines: [{
    product_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: [true, 'Product ID is required']
    },
    variant_id: String,
    quantity: { 
      type: Number, 
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    rental_start_date: { 
      type: Date, 
      required: [true, 'Rental start date is required']
    },
    rental_end_date: { 
      type: Date, 
      required: [true, 'Rental end date is required']
    },
    rental_duration_type: { 
      type: String, 
      enum: ['hourly', 'daily', 'weekly', 'custom'],
      required: [true, 'Duration type is required']
    },
    rental_duration_value: Number,
    unit_price: {
      type: Number,
      required: [true, 'Unit price is required']
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required']
    }
  }],
  
  total_amount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  deposit_amount: {
    type: Number,
    default: 0,
    min: [0, 'Deposit amount cannot be negative']
  },
  notes: String,
  valid_until: Date
}, { 
  timestamps: true 
});

// Indexes
quotationSchema.index({ customer_id: 1 });
quotationSchema.index({ quotation_number: 1 });
quotationSchema.index({ status: 1 });

// Validation: end date must be after start date
quotationSchema.pre('save', function(next) {
  for (const line of this.lines) {
    if (line.rental_end_date <= line.rental_start_date) {
      return next(new Error('Rental end date must be after start date'));
    }
  }
  next();
});

module.exports = mongoose.model('Quotation', quotationSchema);