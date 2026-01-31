const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { 
    type: String, 
    enum: ['customer', 'vendor', 'admin'], 
    default: 'customer'
  },
  company_name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  gstin: { 
    type: String, 
    required: [true, 'GSTIN is required'],
    uppercase: true,
    trim: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    line1: { type: String, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true }
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  email_verified: { 
    type: Boolean, 
    default: false 
  },
  password_reset_token: String,
  password_reset_expires: Date,
  coupon_code_used: String
}, { 
  timestamps: true 
});

// Index for faster email lookups
userSchema.index({ email: 1 });

// Method to get public profile (excluding password)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.password_reset_token;
  delete user.password_reset_expires;
  return user;
};

module.exports = mongoose.model('User', userSchema);