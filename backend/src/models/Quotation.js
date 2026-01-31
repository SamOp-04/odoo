const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quotation_number: { type: String, unique: true, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'confirmed', 'expired'], 
    default: 'draft' 
  },
  
  lines: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant_id: String,
    quantity: { type: Number, required: true },
    rental_start_date: { type: Date, required: true },
    rental_end_date: { type: Date, required: true },
    rental_duration_type: { type: String, enum: ['hourly', 'daily', 'weekly', 'custom'] },
    rental_duration_value: Number,
    unit_price: Number,
    subtotal: Number
  }],
  
  total_amount: Number,
  deposit_amount: Number,
  notes: String,
  valid_until: Date
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);