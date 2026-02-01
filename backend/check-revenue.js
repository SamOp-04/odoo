const mongoose = require('mongoose');
require('dotenv').config();

const Invoice = require('./src/models/Invoice');

const JANE_VENDOR_ID = '507f1f77bcf86cd799439012';

async function checkRevenue() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/odoo-rental');
    console.log('Connected to MongoDB');

    console.log('\n=== Checking Invoices for Jane (vendor_id:', JANE_VENDOR_ID, ') ===');
    
    // Find all invoices
    const allInvoices = await Invoice.find({}).select('invoice_number vendor_id status total_amount');
    console.log('\nAll Invoices:', JSON.stringify(allInvoices, null, 2));

    // Find Jane's invoices
    const janesInvoices = await Invoice.find({ 
      vendor_id: JANE_VENDOR_ID 
    }).select('invoice_number vendor_id status total_amount');
    console.log('\nJanes Invoices:', JSON.stringify(janesInvoices, null, 2));

    // Find paid invoices
    const paidInvoices = await Invoice.find({ 
      vendor_id: JANE_VENDOR_ID,
      status: 'paid' 
    }).select('invoice_number vendor_id status total_amount');
    console.log('\nPaid Invoices:', JSON.stringify(paidInvoices, null, 2));

    // Calculate revenue using aggregation (with ObjectId conversion)
    const revenue = await Invoice.aggregate([
      { $match: { vendor_id: new mongoose.Types.ObjectId(JANE_VENDOR_ID), status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } }
    ]);
    console.log('\nRevenue from aggregation (with ObjectId):', revenue);
    console.log('Total Revenue:', revenue[0]?.total || 0);

    // Check vendor_id types
    console.log('\n=== Checking vendor_id types ===');
    const sampleInvoice = await Invoice.findOne({});
    if (sampleInvoice) {
      console.log('Sample invoice vendor_id:', sampleInvoice.vendor_id);
      console.log('Type:', typeof sampleInvoice.vendor_id);
      console.log('Is ObjectId?', sampleInvoice.vendor_id instanceof mongoose.Types.ObjectId);
      console.log('String comparison:', sampleInvoice.vendor_id.toString() === JANE_VENDOR_ID);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkRevenue();
