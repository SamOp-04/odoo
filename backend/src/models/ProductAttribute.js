const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  display_type: { 
    type: String, 
    enum: ['radio', 'pills', 'color'], 
    default: 'radio' 
  },
  values: [{
    value: { type: String, required: true },
    extraPrice: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);