const mongoose = require('mongoose');

const returnDocumentSchema = new mongoose.Schema({
  order_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RentalOrder', 
    required: [true, 'Order ID is required']
  },
  return_number: { 
    type: String, 
    unique: true, 
    required: [true, 'Return number is required']
  },
  expected_return_date: {
    type: Date,
    required: [true, 'Expected return date is required']
  },
  actual_return_date: {
    type: Date,
    default: Date.now
  },
  condition_notes: String,
  damage_charges: { 
    type: Number, 
    default: 0,
    min: [0, 'Damage charges cannot be negative']
  },
  late_fee: { 
    type: Number, 
    default: 0,
    min: [0, 'Late fee cannot be negative']
  },
  verified_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  
  // Product condition details
  product_condition: [{
    product_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product'
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'damaged']
    },
    notes: String,
    images: [String] // Array of image URLs showing condition
  }],
  
  customer_signature: String, // URL to signature image if needed
  notes: String
}, { 
  timestamps: true 
});

// Indexes
returnDocumentSchema.index({ order_id: 1 });
returnDocumentSchema.index({ return_number: 1 });
returnDocumentSchema.index({ status: 1 });
returnDocumentSchema.index({ expected_return_date: 1 });
returnDocumentSchema.index({ actual_return_date: 1 });

// Virtual to check if return is late
returnDocumentSchema.virtual('is_late').get(function() {
  return this.actual_return_date > this.expected_return_date;
});

module.exports = mongoose.model('ReturnDocument', returnDocumentSchema);