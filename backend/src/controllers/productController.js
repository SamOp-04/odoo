const Product = require('../models/Product');
const { checkAvailability } = require('../services/availability');
const { uploadImageToS3, uploadMultipleImages, deleteImageFromS3, deleteMultipleImages } = require('../services/s3');

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
    
    // Delete associated images from S3
    if (product.images && product.images.length > 0) {
      try {
        await deleteMultipleImages(product.images);
      } catch (error) {
        console.error('Error deleting product images from S3:', error);
        // Continue with product deletion even if image deletion fails
      }
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

/**
 * Upload product images
 * Expects multipart/form-data with files field
 */
const uploadProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }
    
    // Prepare images for upload
    const images = req.files.map(file => ({
      buffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype
    }));
    
    // Upload to S3
    const imageUrls = await uploadMultipleImages(images);
    
    // Add URLs to product
    product.images = [...(product.images || []), ...imageUrls];
    await product.save();
    
    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a specific product image
 */
const deleteProductImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL required' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if image exists in product
    if (!product.images || !product.images.includes(imageUrl)) {
      return res.status(404).json({ error: 'Image not found in product' });
    }
    
    // Delete from S3
    await deleteImageFromS3(imageUrl);
    
    // Remove from product
    product.images = product.images.filter(img => img !== imageUrl);
    await product.save();
    
    res.json({
      message: 'Image deleted successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Replace all product images
 */
const replaceProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }
    
    // Delete old images from S3
    if (product.images && product.images.length > 0) {
      try {
        await deleteMultipleImages(product.images);
      } catch (error) {
        console.error('Error deleting old images:', error);
        // Continue even if deletion fails
      }
    }
    
    // Upload new images
    const images = req.files.map(file => ({
      buffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype
    }));
    
    const imageUrls = await uploadMultipleImages(images);
    
    // Update product
    product.images = imageUrls;
    await product.save();
    
    res.json({
      message: 'Images replaced successfully',
      images: imageUrls,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Set primary/thumbnail image for a product
 */
const setPrimaryImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL required' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.vendor_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Use the model method to set primary image
    await product.setPrimaryImage(imageUrl);
    
    res.json({
      message: 'Primary image set successfully',
      product
    });
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
  checkProductAvailability,
  uploadProductImages,
  deleteProductImage,
  replaceProductImages,
  setPrimaryImage
};