const mongoose = require('mongoose');

const rentalOrderSchema = new mongoose.Schema({
  quotation_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quotation'
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
  order_number: { 
    type: String, 
    unique: true, 
    required: [true, 'Order number is required']
  },
  
  status: { 
    type: String, 
    enum: ['confirmed', 'picked_up', 'with_customer', 'returned', 'cancelled'],
    default: 'confirmed'
  },
  
  lines: [{
    product_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: [true, 'Product ID is required']
    },
    product_name: String, // Denormalized for performance
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
  deposit_paid: { 
    type: Number, 
    default: 0,
    min: [0, 'Deposit cannot be negative']
  },
  full_payment_made: { 
    type: Boolean, 
    default: false 
  },
  payment_status: { 
    type: String, 
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  
  pickup_date: Date,
  return_date: {
    type: Date,
    required: [true, 'Expected return date is required']
  },
  actual_return_date: Date,
  late_fee: { 
    type: Number, 
    default: 0,
    min: [0, 'Late fee cannot be negative']
  },
  
  notes: String
}, { 
  timestamps: true 
});

// Indexes for better query performance
rentalOrderSchema.index({ customer_id: 1 });
rentalOrderSchema.index({ vendor_id: 1 });
rentalOrderSchema.index({ order_number: 1 });
rentalOrderSchema.index({ status: 1 });
rentalOrderSchema.index({ return_date: 1 });

// Virtual to check if order is overdue
rentalOrderSchema.virtual('is_overdue').get(function() {
  if (this.status === 'returned' || this.status === 'cancelled') {
    return false;
  }
  return new Date() > this.return_date;
});

module.exports = mongoose.model('RentalOrder', rentalOrderSchema);