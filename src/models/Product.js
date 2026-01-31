 
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Vendor ID is required']
  },
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  is_rentable: { 
    type: Boolean, 
    default: true 
  },
  quantity_on_hand: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  cost_price: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  sale_price: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  rental_pricing: {
    hourly: {
      type: Number,
      min: [0, 'Hourly price cannot be negative']
    },
    daily: {
      type: Number,
      min: [0, 'Daily price cannot be negative']
    },
    weekly: {
      type: Number,
      min: [0, 'Weekly price cannot be negative']
    },
    custom: {
      price: {
        type: Number,
        min: [0, 'Custom price cannot be negative']
      },
      period_days: {
        type: Number,
        min: [1, 'Period must be at least 1 day']
      }
    }
  },
  security_deposit: { 
    type: Number, 
    default: 0,
    min: [0, 'Security deposit cannot be negative']
  },
  is_published: { 
    type: Boolean, 
    default: false 
  },
  images: [String], // Array of image URLs
  
  // Variants and Attributes
  attributes: [{
    name: {
      type: String,
      trim: true
    }, // e.g., 'Color', 'Size'
    value: {
      type: String,
      trim: true
    } // e.g., 'Red', 'Large'
  }],
  variants: [{
    sku: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      min: [0, 'Variant quantity cannot be negative']
    },
    price_adjustment: { 
      type: Number, 
      default: 0 
    },
    attributes: [{
      name: {
        type: String,
        trim: true
      },
      value: {
        type: String,
        trim: true
      }
    }]
  }]
}, { 
  timestamps: true 
});

// Indexes for better query performance
productSchema.index({ vendor_id: 1 });
productSchema.index({ is_published: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for checking if product has rental pricing
productSchema.virtual('has_rental_pricing').get(function() {
  return !!(this.rental_pricing.hourly || 
           this.rental_pricing.daily || 
           this.rental_pricing.weekly || 
           this.rental_pricing.custom?.price);
});

module.exports = mongoose.model('Product', productSchema);