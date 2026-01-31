const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: mongoose.Schema.Types.Mixed,
  data_type: { type: String, enum: ['string', 'number', 'boolean', 'json'] },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);