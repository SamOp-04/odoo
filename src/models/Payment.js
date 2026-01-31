const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoice_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Invoice', 
    required: [true, 'Invoice ID is required']
  },
  order_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RentalOrder', 
    required: [true, 'Order ID is required']
  },
  customer_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Customer ID is required']
  },
  
  amount: { 
    type: Number, 
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  payment_method: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'netbanking', 'online'],
    default: 'cash'
  },
  payment_status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'],
    default: 'success' // Auto-success for hackathon/demo
  },
  
  transaction_id: String, // Payment gateway transaction ID
  payment_date: { 
    type: Date, 
    default: Date.now 
  },
  notes: String,
  
  // Payment gateway response (for online payments)
  gateway_response: mongoose.Schema.Types.Mixed
}, { 
  timestamps: true 
});

// Indexes
paymentSchema.index({ invoice_id: 1 });
paymentSchema.index({ order_id: 1 });
paymentSchema.index({ customer_id: 1 });
paymentSchema.index({ transaction_id: 1 });
paymentSchema.index({ payment_status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);