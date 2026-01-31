const Product = require('../models/Product');
const { checkAvailability } = require('../services/availability');

const getProducts = async (req, res) => {
  try {
    const { category, is_published } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (is_published !== undefined) filter.is_published = is_published === 'true';
    
    const products = await Product.find(filter).populate('vendor_id', 'name company_name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor_id');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      vendor_id: req.user.id
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    Object.assign(product, req.body);
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const togglePublish = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    product.is_published = !product.is_published;
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkProductAvailability = async (req, res) => {
  try {
    const { productId, variantId, quantity, startDate, endDate } = req.body;
    
    const availability = await checkAvailability(
      productId,
      variantId,
      quantity,
      new Date(startDate),
      new Date(endDate)
    );
    
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  togglePublish,
  checkProductAvailability
};