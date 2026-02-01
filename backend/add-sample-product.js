const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/Product');

const JANE_VENDOR_ID = '507f1f77bcf86cd799439012';

async function addSampleProduct() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/odoo-rental');
    console.log('Connected to MongoDB');

    const newProduct = {
      vendor_id: new mongoose.Types.ObjectId(JANE_VENDOR_ID),
      name: 'Professional DSLR Camera Kit',
      description: 'Canon EOS 5D Mark IV with 24-70mm lens, perfect for photography and videography. Includes camera body, lens, battery pack, memory cards, and carrying case.',
      category: 'Cameras',
      quantity_on_hand: 3,
      cost_price: 150000,
      rental_pricing: {
        hourly: 500,
        daily: 2500,
        weekly: 15000
      },
      security_deposit: 10000,
      is_published: true,
      images: []
    };

    console.log('\nCreating new product:', newProduct.name);
    const product = await Product.create(newProduct);
    console.log('✅ Product created successfully!');
    console.log('Product ID:', product._id);
    console.log('Product Name:', product.name);
    console.log('Category:', product.category);
    console.log('Daily Rate: ₹', product.rental_pricing.daily);
    console.log('Published:', product.is_published);
    
    console.log('\n=== All Jane\'s Products ===');
    const allProducts = await Product.find({ 
      vendor_id: new mongoose.Types.ObjectId(JANE_VENDOR_ID) 
    }).select('name category quantity_on_hand is_published rental_pricing.daily');
    
    allProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (${p.category}) - ₹${p.rental_pricing?.daily}/day - ${p.is_published ? 'Published' : 'Unpublished'} - Stock: ${p.quantity_on_hand}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addSampleProduct();
