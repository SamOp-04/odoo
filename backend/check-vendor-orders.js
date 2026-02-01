const mongoose = require('mongoose');
require('dotenv').config();

const RentalOrder = require('./src/models/RentalOrder');
const User = require('./src/models/User');
const Product = require('./src/models/Product');

const JANE_VENDOR_ID = '507f1f77bcf86cd799439012';

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/odoo-rental');
    console.log('Connected to MongoDB');

    console.log('\n=== Jane\'s Orders ===');
    const orders = await RentalOrder.find({ 
      vendor_id: new mongoose.Types.ObjectId(JANE_VENDOR_ID) 
    })
    .populate('customer_id', 'name email company_name')
    .populate('lines.product_id', 'name images category');
    
    console.log(`Total Orders: ${orders.length}\n`);
    
    orders.forEach((order, i) => {
      console.log(`${i + 1}. Order ${order.order_number}`);
      console.log(`   Customer: ${order.customer_id?.name} (${order.customer_id?.email})`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Products: ${order.lines.map(l => l.product_name).join(', ')}`);
      console.log(`   Pickup Date: ${order.pickup_date ? new Date(order.pickup_date).toLocaleDateString() : 'Not set'}`);
      console.log(`   Return Date: ${order.return_date ? new Date(order.return_date).toLocaleDateString() : 'Not set'}`);
      console.log(`   Total: ₹${order.total_amount}`);
      console.log('');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkOrders();
