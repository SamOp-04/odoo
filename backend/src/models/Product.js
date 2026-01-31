const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  category: String,
  is_rentable: { type: Boolean, default: true },
  quantity_on_hand: { type: Number, required: true, default: 0 },
  cost_price: Number,
  sale_price: Number,
  rental_pricing: {
    hourly: Number,
    daily: Number,
    weekly: Number,
    custom: {
      price: Number,
      period_days: Number
    }
  },
  security_deposit: { type: Number, default: 0 },
  is_published: { type: Boolean, default: false },
  images: [String],
  
  attributes: [{
    name: String,
    value: String
  }],
  variants: [{
    sku: String,
    name: String,
    quantity: Number,
    price_adjustment: { type: Number, default: 0 },
    attributes: [{
      name: String,
      value: String
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);