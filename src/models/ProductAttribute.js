const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  values: [String]
}, { timestamps: true });

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);