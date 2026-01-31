require('dotenv').config();
const mongoose = require('mongoose');

async function clearDuplicates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await mongoose.connection.db.collection('productattributes').deleteMany({});
    console.log('✓ Cleared productattributes collection');

    await mongoose.connection.close();
    console.log('✅ Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearDuplicates();