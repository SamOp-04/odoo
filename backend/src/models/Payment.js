const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalOrder', required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  amount: { type: Number, required: true },
  payment_method: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'netbanking'],
    default: 'cash'
  },
  payment_status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'],
    default: 'success'
  },
  
  transaction_id: String,
  payment_date: { type: Date, default: Date.now },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);