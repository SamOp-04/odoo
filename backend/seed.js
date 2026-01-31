require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('./seed-data');

const User = require('./src/models/User');
const Product = require('./src/models/Product');
const ProductAttribute = require('./src/models/ProductAttribute');
const Quotation = require('./src/models/Quotation');
const RentalOrder = require('./src/models/RentalOrder');
const Reservation = require('./src/models/Reservation');
const Invoice = require('./src/models/Invoice');
const Payment = require('./src/models/Payment');
const PickupDocument = require('./src/models/PickupDocument');
const ReturnDocument = require('./src/models/ReturnDocument');
const Notification = require('./src/models/Notification');
const Coupon = require('./src/models/Coupon');
const Settings = require('./src/models/Settings');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});
    await ProductAttribute.deleteMany({});
    await Quotation.deleteMany({});
    await RentalOrder.deleteMany({});
    await Reservation.deleteMany({});
    await Invoice.deleteMany({});
    await Payment.deleteMany({});
    await PickupDocument.deleteMany({});
    await ReturnDocument.deleteMany({});
    await Notification.deleteMany({});
    await Coupon.deleteMany({});
    await Settings.deleteMany({});
    console.log('Cleared existing data');

    await User.insertMany(seedData.users);
    console.log('✓ Users seeded');

    await Product.insertMany(seedData.products);
    console.log('✓ Products seeded');

    await ProductAttribute.insertMany(seedData.productAttributes);
    console.log('✓ Product Attributes seeded');

    await Quotation.insertMany(seedData.quotations);
    console.log('✓ Quotations seeded');

    await RentalOrder.insertMany(seedData.rentalOrders);
    console.log('✓ Rental Orders seeded');

    await Reservation.insertMany(seedData.reservations);
    console.log('✓ Reservations seeded');

    await Invoice.insertMany(seedData.invoices);
    console.log('✓ Invoices seeded');

    await Payment.insertMany(seedData.payments);
    console.log('✓ Payments seeded');

    await PickupDocument.insertMany(seedData.pickupDocuments);
    console.log('✓ Pickup Documents seeded');

    await Notification.insertMany(seedData.notifications);
    console.log('✓ Notifications seeded');

    await Coupon.insertMany(seedData.coupons);
    console.log('✓ Coupons seeded');

    await Settings.insertMany(seedData.settings);
    console.log('✓ Settings seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Customer: john@customer.com / password123');
    console.log('Vendor: jane@vendor.com / password123');
    console.log('Admin: admin@rental.com / admin123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();