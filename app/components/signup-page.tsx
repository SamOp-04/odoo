'use client';

import React, { useState } from 'react';

const SignupPage = () => {
  const [userType, setUserType] = useState('customer'); // 'customer' or 'vendor'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    gstin: '',
    password: '',
    confirmPassword: '',
    couponCode: '',
    productCategory: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
      const newErrors: {[key: string]: string} = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (userType === 'vendor' && !formData.gstin) newErrors.gstin = 'GSTIN is required for vendors';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (userType === 'vendor' && !formData.productCategory) {
      newErrors.productCategory = 'Product category is required for vendors';
    }

    return newErrors;
  };

  const handleRegister = async () => {
    setIsLoading(true);
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Mock registration logic
      if (userType === 'vendor') {
        window.location.href = '/vendor-dashboard';
      } else {
        window.location.href = '/product-listing';
      }
      setIsLoading(false);
    }, 2000);
  };

  const productCategories = [
    'Electronics',
    'Photography Equipment',
    'Audio & Video',
    'Lighting Equipment',
    'Sports Equipment',
    'Home & Garden',
    'Furniture',
    'Vehicles',
    'Tools & Machinery',
    'Event Supplies'
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-8">
      <div className="flex gap-8 w-full max-w-6xl">
        {/* Login Card (Left) */}
        <div className="w-full max-w-md">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
            {/* Logo Placeholder */}
            <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
              <span className="text-gray-400 text-xs">LOGO</span>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-6">Log In</h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Login ID</label>
                <input
                  type="text"
                  placeholder="Enter email or username"
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
            </div>

            <button className="w-full mt-8 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors">
              Log In
            </button>

            <div className="mt-6 space-y-2 text-center">
              <a href="/forgot-password" className="block text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot Password?
              </a>
              <p className="text-sm text-gray-400">
                Do not have an account?{' '}
                <span className="text-blue-400">Register here →</span>
              </p>
            </div>
          </div>
        </div>

        {/* Signup Card (Right) */}
        <div className="w-full max-w-md">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
            {/* Logo Placeholder */}
            <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
              <span className="text-gray-400 text-xs">LOGO</span>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-6">Sign Up</h1>

            {/* User Type Toggle */}
            <div className="flex mb-6 bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setUserType('customer')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                  userType === 'customer' ? 'bg-pink-600 text-white' : 'text-gray-400'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setUserType('vendor')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                  userType === 'vendor' ? 'bg-pink-600 text-white' : 'text-gray-400'
                }`}
              >
                Vendor
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {/* First Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
                {errors.companyName && <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>}
              </div>

              {/* GSTIN (for vendors) */}
              {userType === 'vendor' && (
                <div>
                  <label className="block text-sm text-gray-300 mb-2">GSTIN</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  {errors.gstin && <p className="text-red-400 text-xs mt-1">{errors.gstin}</p>}
                </div>
              )}

              {/* Product Category (for vendors) */}
              {userType === 'vendor' && (
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Product Category</label>
                  <select
                    value={formData.productCategory}
                    onChange={(e) => handleInputChange('productCategory', e.target.value)}
                    className="w-full px-0 py-2 bg-gray-800 border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="">Select category</option>
                    {productCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.productCategory && <p className="text-red-400 text-xs mt-1">{errors.productCategory}</p>}
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with uppercase, lowercase, and special characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Coupon Code */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Coupon Code (optional)</label>
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => handleInputChange('couponCode', e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full mt-6 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Register'
              )}
            </button>

            {/* Vendor Link */}
            {userType === 'customer' && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setUserType('vendor')}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Become a vendor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;