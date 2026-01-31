const mongoose = require('mongoose');

const pickupDocumentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalOrder', required: true },
  pickup_number: { type: String, unique: true, required: true },
  pickup_date: Date,
  pickup_instructions: String,
  verified_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('PickupDocument', pickupDocumentSchema);