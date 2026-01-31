const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Attribute name is required'],
    unique: true,
    trim: true
  }, // e.g., 'Color', 'Brand', 'Size'
  values: [{
    type: String,
    trim: true
  }], // e.g., ['Red', 'Blue', 'Green']
  is_active: {
    type: Boolean,
    default: true
  },
  description: String
}, { 
  timestamps: true 
});

// Index
productAttributeSchema.index({ name: 1 });

// Method to add a value if it doesn't exist
productAttributeSchema.methods.addValue = function(value) {
  if (!this.values.includes(value)) {
    this.values.push(value);
  }
  return this.save();
};

// Method to remove a value
productAttributeSchema.methods.removeValue = function(value) {
  this.values = this.values.filter(v => v !== value);
  return this.save();
};

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);