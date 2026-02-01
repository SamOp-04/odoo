require('dotenv').config();
const mongoose = require('mongoose');
const RentalOrder = require('./src/models/RentalOrder');
const Invoice = require('./src/models/Invoice');

async function checkVendorOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const vendorId = '507f1f77bcf86cd799439012'; // Jane's vendor ID

    // Check orders
    const orders = await RentalOrder.find({ vendor_id: vendorId })
      .populate('customer_id', 'name')
      .populate('lines.product_id', 'name');
    
    console.log(`Total Orders for Jane: ${orders.length}\n`);
    
    orders.forEach((order, i) => {
      console.log(`${i + 1}. Order #${order.order_number}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Customer: ${order.customer_id?.name || 'N/A'}`);
      console.log(`   Total: ₹${order.total_amount}`);
      console.log(`   Products: ${order.lines?.map(l => l.product_id?.name || l.product_name || 'Unknown').join(', ')}`);
      console.log();
    });

    // Check invoices
    const invoices = await Invoice.find({ vendor_id: vendorId, status: 'paid' });
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    
    console.log(`Paid Invoices: ${invoices.length}`);
    console.log(`Total Revenue: ₹${totalRevenue}\n`);

    // Check active rentals
    const activeRentals = await RentalOrder.countDocuments({ 
      vendor_id: vendorId, 
      status: 'with_customer'
    });
    console.log(`Active Rentals (status: with_customer): ${activeRentals}\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkVendorOrders();
