const Settings = require('../models/Settings');
const ProductAttribute = require('../models/ProductAttribute');

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { key, value, data_type } = req.body;
    
    const setting = await Settings.findOneAndUpdate(
      { key },
      { value, data_type },
      { new: true, upsert: true }
    );
    
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttributes = async (req, res) => {
  try {
    const attributes = await ProductAttribute.find();
    res.json(attributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAttribute = async (req, res) => {
  try {
    const attribute = await ProductAttribute.create(req.body);
    res.status(201).json(attribute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAttribute = async (req, res) => {
  try {
    const attribute = await ProductAttribute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!attribute) {
      return res.status(404).json({ error: 'Attribute not found' });
    }
    
    res.json(attribute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAttribute = async (req, res) => {
  try {
    const attribute = await ProductAttribute.findByIdAndDelete(req.params.id);
    
    if (!attribute) {
      return res.status(404).json({ error: 'Attribute not found' });
    }
    
    res.json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute
};