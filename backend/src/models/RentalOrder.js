const mongoose = require('mongoose');

const rentalOrderSchema = new mongoose.Schema({
  quotation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_number: { type: String, unique: true, required: true },
  
  status: { 
    type: String, 
    enum: ['confirmed', 'picked_up', 'with_customer', 'returned', 'cancelled'],
    default: 'confirmed'
  },
  
  lines: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    product_name: String,
    variant_id: String,
    quantity: Number,
    rental_start_date: Date,
    rental_end_date: Date,
    unit_price: Number,
    subtotal: Number
  }],
  
  total_amount: Number,
  deposit_paid: { type: Number, default: 0 },
  full_payment_made: { type: Boolean, default: false },
  payment_status: { 
    type: String, 
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  
  pickup_date: Date,
  return_date: Date,
  actual_return_date: Date,
  late_fee: { type: Number, default: 0 },
  
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('RentalOrder', rentalOrderSchema);