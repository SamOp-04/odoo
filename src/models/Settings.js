const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { 
    type: String, 
    unique: true, 
    required: [true, 'Setting key is required']
  },
  value: mongoose.Schema.Types.Mixed,
  data_type: { 
    type: String, 
    enum: ['string', 'number', 'boolean', 'json', 'array'],
    required: [true, 'Data type is required']
  },
  description: String,
  category: {
    type: String,
    enum: ['general', 'rental', 'pricing', 'tax', 'notification', 'payment']
  },
  is_editable: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Index
settingsSchema.index({ key: 1 });
settingsSchema.index({ category: 1 });

// Static method to get setting value by key
settingsSchema.statics.getValue = async function(key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set setting value
settingsSchema.statics.setValue = async function(key, value, dataType = 'string', description = '') {
  return await this.findOneAndUpdate(
    { key },
    { value, data_type: dataType, description },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('Settings', settingsSchema);