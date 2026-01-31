const mongoose = require('mongoose');

const returnDocumentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalOrder', required: true },
  return_number: { type: String, unique: true, required: true },
  expected_return_date: Date,
  actual_return_date: Date,
  condition_notes: String,
  damage_charges: { type: Number, default: 0 },
  late_fee: { type: Number, default: 0 },
  verified_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('ReturnDocument', returnDocumentSchema);