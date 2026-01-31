const mongoose = require('mongoose');

const pickupDocumentSchema = new mongoose.Schema({
  order_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RentalOrder', 
    required: [true, 'Order ID is required']
  },
  pickup_number: { 
    type: String, 
    unique: true, 
    required: [true, 'Pickup number is required']
  },
  pickup_date: {
    type: Date,
    default: Date.now
  },
  pickup_instructions: String,
  verified_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  customer_signature: String, // URL to signature image if needed
  notes: String
}, { 
  timestamps: true 
});

// Indexes
pickupDocumentSchema.index({ order_id: 1 });
pickupDocumentSchema.index({ pickup_number: 1 });
pickupDocumentSchema.index({ status: 1 });

module.exports = mongoose.model('PickupDocument', pickupDocumentSchema);