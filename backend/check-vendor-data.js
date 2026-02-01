require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const RentalOrder = require('./src/models/RentalOrder');
const Invoice = require('./src/models/Invoice');

async function checkVendorData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Find all vendors
    const vendors = await User.find({ role: 'vendor' });
    console.log(`📊 Total Vendors: ${vendors.length}`);
    
    if (vendors.length === 0) {
      console.log('\n⚠️  No vendors found in database!');
      console.log('Run: node seed.js to create seed data\n');
      process.exit(0);
    }

    for (const vendor of vendors) {
      console.log(`\n📦 Vendor: ${vendor.name} (${vendor.email})`);
      console.log(`   ID: ${vendor._id}`);
      
      const products = await Product.countDocuments({ vendor_id: vendor._id });
      const publishedProducts = await Product.countDocuments({ 
        vendor_id: vendor._id, 
        is_published: true 
      });
      const orders = await RentalOrder.countDocuments({ vendor_id: vendor._id });
      const activeOrders = await RentalOrder.countDocuments({ 
        vendor_id: vendor._id, 
        status: 'with_customer'
      });
      const invoices = await Invoice.find({ vendor_id: vendor._id, status: 'paid' });
      const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      
      console.log(`   - Products: ${products} (${publishedProducts} published)`);
      console.log(`   - Orders: ${orders} (${activeOrders} active)`);
      console.log(`   - Revenue: ₹${totalRevenue.toFixed(2)}`);
    }

    // Check if products have vendor_id
    const productsWithoutVendor = await Product.countDocuments({ vendor_id: null });
    if (productsWithoutVendor > 0) {
      console.log(`\n⚠️  Warning: ${productsWithoutVendor} products without vendor_id`);
      
      // Assign them to first vendor
      if (vendors.length > 0) {
        await Product.updateMany(
          { vendor_id: null },
          { vendor_id: vendors[0]._id }
        );
        console.log(`✓ Assigned ${productsWithoutVendor} products to ${vendors[0].name}`);
      }
    }

    console.log('\n✅ Check complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkVendorData();
