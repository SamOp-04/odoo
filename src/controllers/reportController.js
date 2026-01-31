const RentalOrder = require('../models/RentalOrder');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = { status: 'paid' };
    
    if (req.user.role === 'vendor') {
      filter.vendor_id = req.user.id;
    }
    
    if (startDate && endDate) {
      filter.invoice_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const revenue = await Invoice.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$invoice_date' },
            month: { $month: '$invoice_date' }
          },
          totalRevenue: { $sum: '$total_amount' },
          totalTax: { $sum: '$tax_amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
    
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductReport = async (req, res) => {
  try {
    const filter = {};
    
    if (req.user.role === 'vendor') {
      filter['lines.product_id.vendor_id'] = req.user.id;
    }
    
    const productStats = await RentalOrder.aggregate([
      { $unwind: '$lines' },
      {
        $lookup: {
          from: 'products',
          localField: 'lines.product_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$lines.product_id',
          productName: { $first: '$product.name' },
          totalRentals: { $sum: 1 },
          totalQuantity: { $sum: '$lines.quantity' },
          totalRevenue: { $sum: '$lines.subtotal' }
        }
      },
      { $sort: { totalRentals: -1 } }
    ]);
    
    res.json(productStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrdersReport = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    const filter = {};
    
    if (req.user.role === 'customer') {
      filter.customer_id = req.user.id;
    } else if (req.user.role === 'vendor') {
      filter.vendor_id = req.user.id;
    }
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (status) {
      filter.status = status;
    }
    
    const orders = await RentalOrder.find(filter)
      .populate('customer_id', 'name company_name')
      .populate('vendor_id', 'name company_name')
      .populate('lines.product_id')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRevenueReport,
  getProductReport,
  getOrdersReport
};