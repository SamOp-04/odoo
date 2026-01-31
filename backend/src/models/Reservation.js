const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant_id: String,
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalOrder', required: true },
  quantity_reserved: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, { timestamps: true });

reservationSchema.index({ product_id: 1, start_date: 1, end_date: 1, status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);