'use client';

import React, { useState } from 'react';

const AuthenticationApp = () => {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'signup', 'forgot-password'

  const LoginPage = () => {
    const [formData, setFormData] = useState({
      loginId: '',
      password: ''
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    };

    const handleLogin = async () => {
      setIsLoading(true);
      setErrors({});

      const newErrors: {[key: string]: string} = {};
      if (!formData.loginId) newErrors.loginId = 'Login ID is required';
      if (!formData.password) newErrors.password = 'Password is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        if (formData.loginId === 'admin@example.com') {
          alert('Redirect to Admin Dashboard');
        } else if (formData.loginId === 'vendor@example.com') {
          alert('Redirect to Vendor Dashboard');
        } else if (formData.loginId === 'customer@example.com') {
          alert('Redirect to Customer Product Listing');
        } else {
          setErrors({ general: 'Invalid User ID or Password' });
        }
        setIsLoading(false);
      }, 2000);
    };

    return (
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
          <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
            <span className="text-gray-400 text-xs">LOGO</span>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-8">Log In</h1>

          {errors.general && (
            <div className="text-red-400 text-sm text-center mb-4 p-3 bg-red-900/20 border border-red-600 rounded">
              {errors.general}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Login ID</label>
              <input
                type="text"
                value={formData.loginId}
                onChange={(e) => handleInputChange('loginId', e.target.value)}
                placeholder="Enter email or username"
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              {errors.loginId && <p className="text-red-400 text-xs mt-1">{errors.loginId}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full mt-8 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              'Log In'
            )}
          </button>

          <div className="mt-6 space-y-2 text-center">
            <button
              onClick={() => setCurrentPage('forgot-password')}
              className="block w-full text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot Password?
            </button>
            <p className="text-sm text-gray-400">
              Do not have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SignupPage = () => {
    const [userType, setUserType] = useState('customer');
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

      setTimeout(() => {
        if (userType === 'vendor') {
          alert('Redirect to Vendor Dashboard');
        } else {
          alert('Redirect to Customer Product Listing');
        }
        setIsLoading(false);
      }, 2000);
    };

    const productCategories = [
      'Electronics', 'Photography Equipment', 'Audio & Video', 'Lighting Equipment',
      'Sports Equipment', 'Home & Garden', 'Furniture', 'Vehicles', 'Tools & Machinery', 'Event Supplies'
    ];

    return (
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
          <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
            <span className="text-gray-400 text-xs">LOGO</span>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-6">Sign Up</h1>

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

          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
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

            {userType === 'vendor' && (
              <>
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
              </>
            )}

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

          <div className="mt-4 text-center">
            <button
              onClick={() => setCurrentPage('login')}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Already have an account? Login here
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
      setIsLoading(true);
      setError('');
      setSuccess('');

      if (!email) {
        setError('Email is required');
        setIsLoading(false);
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        const validEmails = ['admin@example.com', 'vendor@example.com', 'customer@example.com'];
        
        if (!validEmails.includes(email)) {
          setError('Email not found in our system');
        } else {
          setSuccess('The password reset link has been sent to your email.');
        }
        
        setIsLoading(false);
      }, 2000);
    };

    return (
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-12 text-center">Reset Password Page</h1>
        
        <div className="w-full max-w-md">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
            <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
              <span className="text-gray-400 text-xs">LOGO</span>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-8">Reset Password</h2>

            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-3">Enter Email ID:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                placeholder="Enter your registered email"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors text-lg"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <div className="mb-8 p-4 border-2 border-dashed border-orange-500 bg-orange-900/20 rounded-lg">
              <p className="text-orange-300 text-sm text-center">
                The system should verify whether the entered email exists.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Submit'
              )}
            </button>

            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentPage('login')}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </div>

          {success && (
            <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
              <p className="text-blue-300 text-sm text-center">{success}</p>
              <div className="mt-3 text-center">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Return to Login →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <div className="flex gap-8 w-full max-w-6xl">
            <LoginPage />
            <div className="w-full max-w-md flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl text-gray-400 mb-4">New to our platform?</h2>
                <button
                  onClick={() => setCurrentPage('signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full border border-white transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        );
      case 'signup':
        return (
          <div className="flex gap-8 w-full max-w-6xl">
            <div className="w-full max-w-md flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl text-gray-400 mb-4">Already have an account?</h2>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full border border-white transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
            <SignupPage />
          </div>
        );
      case 'forgot-password':
        return <ForgotPasswordPage />;
      default:
        return <LoginPage />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-8">
      {renderCurrentPage()}
    </div>
  );
};

export default AuthenticationApp;