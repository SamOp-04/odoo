const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required']
  },
  type: { 
    type: String, 
    enum: [
      'pickup_reminder', 
      'return_due', 
      'late_return', 
      'payment_success',
      'payment_failed',
      'order_confirmed',
      'order_cancelled',
      'quotation_sent',
      'invoice_generated'
    ],
    required: [true, 'Notification type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  is_read: { 
    type: Boolean, 
    default: false 
  },
  related_order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RentalOrder' 
  },
  related_invoice: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Invoice' 
  },
  related_quotation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quotation' 
  },
  
  // Optional action URL
  action_url: String,
  
  // Expiry for temporary notifications
  expires_at: Date
}, { 
  timestamps: true 
});

// Indexes
notificationSchema.index({ user_id: 1, is_read: 1 });
notificationSchema.index({ user_id: 1, createdAt: -1 });
notificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('Notification', notificationSchema);