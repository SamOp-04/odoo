const mongoose = require('mongoose');
const RentalOrder = require('../models/RentalOrder');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

const getCustomerDashboard = async (req, res) => {
  try {
    const customerId = new mongoose.Types.ObjectId(req.user.id);
    
    const totalOrders = await RentalOrder.countDocuments({ customer_id: customerId });
    const activeOrders = await RentalOrder.countDocuments({ 
      customer_id: customerId, 
      status: { $in: ['confirmed', 'with_customer'] }
    });
    
    const orders = await RentalOrder.find({ customer_id: customerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('lines.product_id');
    
    const invoices = await Invoice.find({ customer_id: customerId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    const totalSpent = await Invoice.aggregate([
      { $match: { customer_id: customerId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } }
    ]);
    
    res.json({
      totalOrders,
      activeOrders,
      totalSpent: totalSpent[0]?.total || 0,
      recentOrders: orders,
      recentInvoices: invoices
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = new mongoose.Types.ObjectId(req.user.id);
    
    const totalProducts = await Product.countDocuments({ vendor_id: vendorId });
    const publishedProducts = await Product.countDocuments({ 
      vendor_id: vendorId, 
      is_published: true 
    });
    
    const totalOrders = await RentalOrder.countDocuments({ vendor_id: vendorId });
    const activeRentals = await RentalOrder.countDocuments({ 
      vendor_id: vendorId, 
      status: 'with_customer'
    });
    
    const revenue = await Invoice.aggregate([
      { $match: { vendor_id: vendorId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } }
    ]);
    
    const recentOrders = await RentalOrder.find({ vendor_id: vendorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer_id', 'name company_name')
      .populate({
        path: 'lines.product_id',
        select: 'name images category'
      });
    
    res.json({
      totalProducts,
      publishedProducts,
      totalOrders,
      activeRentals,
      totalRevenue: revenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await RentalOrder.countDocuments();
    const totalRevenue = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } }
    ]);
    
    const ordersByStatus = await RentalOrder.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const recentOrders = await RentalOrder.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customer_id', 'name company_name')
      .populate('vendor_id', 'name company_name');
    
    res.json({
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCustomerDashboard,
  getVendorDashboard,
  getAdminDashboard
};