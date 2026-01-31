const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  product_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: [true, 'Product ID is required']
  },
  variant_id: String,
  order_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RentalOrder', 
    required: [true, 'Order ID is required']
  },
  quantity_reserved: { 
    type: Number, 
    required: [true, 'Quantity reserved is required'],
    min: [1, 'Quantity must be at least 1']
  },
  start_date: { 
    type: Date, 
    required: [true, 'Start date is required']
  },
  end_date: { 
    type: Date, 
    required: [true, 'End date is required']
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, { 
  timestamps: true 
});

// Critical index for fast availability queries
reservationSchema.index({ product_id: 1, start_date: 1, end_date: 1, status: 1 });
reservationSchema.index({ order_id: 1 });

// Validation: end date must be after start date
reservationSchema.pre('save', function(next) {
  if (this.end_date <= this.start_date) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);