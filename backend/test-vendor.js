require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');

async function testVendorAccess() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Find vendor
    const vendor = await User.findOne({ email: 'jane@vendor.com' });
    if (!vendor) {
      console.log('❌ Vendor not found!');
      process.exit(1);
    }

    console.log('✓ Vendor found:', vendor.name);
    console.log('  Email:', vendor.email);
    console.log('  Role:', vendor.role);
    console.log('  ID:', vendor._id.toString());

    // Find vendor's products
    const products = await Product.find({ vendor_id: vendor._id });
    console.log('\n✓ Vendor Products:', products.length);
    
    products.forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.name}`);
      console.log('   Category:', p.category || 'None');
      console.log('   Published:', p.is_published);
      console.log('   Stock:', p.quantity_on_hand);
      console.log('   Images:', p.images?.length || 0);
      if (p.rental_pricing) {
        console.log('   Pricing:');
        if (p.rental_pricing.daily) console.log('     Daily: ₹' + p.rental_pricing.daily);
        if (p.rental_pricing.weekly) console.log('     Weekly: ₹' + p.rental_pricing.weekly);
      }
    });

    console.log('\n✅ Test complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testVendorAccess();
