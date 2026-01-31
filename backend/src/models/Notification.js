const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['pickup_reminder', 'return_due', 'late_return', 'payment_success', 'order_confirmed']
  },
  title: String,
  message: String,
  is_read: { type: Boolean, default: false },
  related_order: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalOrder' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);