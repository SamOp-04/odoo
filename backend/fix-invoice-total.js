const mongoose = require('mongoose');
require('dotenv').config();

const Invoice = require('./src/models/Invoice');

const JANE_VENDOR_ID = '507f1f77bcf86cd799439012';

async function fixInvoice() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/odoo-rental');
    console.log('Connected to MongoDB');

    // Find the paid invoice
    const paidInvoice = await Invoice.findOne({ 
      vendor_id: new mongoose.Types.ObjectId(JANE_VENDOR_ID),
      status: 'paid'
    });

    if (paidInvoice) {
      console.log('\nCurrent paid invoice:');
      console.log('Invoice Number:', paidInvoice.invoice_number);
      console.log('Current Total:', paidInvoice.total_amount);
      
      // Update to 3450
      paidInvoice.total_amount = 3450;
      await paidInvoice.save();
      
      console.log('Updated Total:', paidInvoice.total_amount);
      console.log('✅ Invoice updated successfully!');
    } else {
      console.log('No paid invoice found');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixInvoice();
