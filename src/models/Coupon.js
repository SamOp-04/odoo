const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, uppercase: true },
  description: String,
  discount_type: { type: String, enum: ['percentage', 'fixed'] },
  discount_value: Number,
  min_order_value: { type: Number, default: 0 },
  max_uses: Number,
  used_count: { type: Number, default: 0 },
  valid_from: Date,
  valid_until: Date,
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);