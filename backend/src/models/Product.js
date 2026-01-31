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
  
  // Product images stored in AWS S3
  // Array of S3 public URLs
  // First image is considered the primary/thumbnail image
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        // Limit to maximum 10 images per product
        return arr.length <= 10;
      },
      message: 'Maximum 10 images allowed per product'
    }
  },
  
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
    }],
    // Variant-specific images (optional)
    images: {
      type: [String],
      default: []
    }
  }]
}, { timestamps: true });

// Indexes for better query performance
productSchema.index({ vendor_id: 1, is_published: 1 });
productSchema.index({ category: 1, is_published: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Text search

// Virtual for primary/thumbnail image
productSchema.virtual('primaryImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Method to add image
productSchema.methods.addImage = function(imageUrl) {
  if (this.images.length >= 10) {
    throw new Error('Maximum 10 images allowed');
  }
  this.images.push(imageUrl);
  return this.save();
};

// Method to remove image
productSchema.methods.removeImage = function(imageUrl) {
  this.images = this.images.filter(img => img !== imageUrl);
  return this.save();
};

// Method to set primary image (move to first position)
productSchema.methods.setPrimaryImage = function(imageUrl) {
  const index = this.images.indexOf(imageUrl);
  if (index > -1) {
    this.images.splice(index, 1);
    this.images.unshift(imageUrl);
    return this.save();
  }
  throw new Error('Image not found in product');
};

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);