'use client';

import React, { useState } from 'react';

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
    // Clear error when user starts typing
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

    // Basic validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.loginId) {
      newErrors.loginId = 'Login ID is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Mock authentication logic
      if (formData.loginId === 'admin@example.com') {
        // Redirect to admin dashboard
        window.location.href = '/admin-dashboard';
      } else if (formData.loginId === 'vendor@example.com') {
        // Redirect to vendor dashboard
        window.location.href = '/vendor-dashboard';
      } else if (formData.loginId === 'customer@example.com') {
        // Redirect to customer product listing
        window.location.href = '/product-listing';
      } else {
        // Show error for invalid credentials
        setErrors({ general: 'Invalid User ID or Password' });
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
          {/* Logo Placeholder */}
          <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
            <span className="text-gray-400 text-xs">LOGO</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-8">Log In</h1>

          {/* General Error */}
          {errors.general && (
            <div className="text-red-400 text-sm text-center mb-4 p-3 bg-red-900/20 border border-red-600 rounded">
              {errors.general}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Login ID Field */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Login ID</label>
              <input
                type="text"
                value={formData.loginId}
                onChange={(e) => handleInputChange('loginId', e.target.value)}
                placeholder="Enter email or username"
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              {errors.loginId && (
                <p className="text-red-400 text-xs mt-1">{errors.loginId}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Login Button */}
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

          {/* Links */}
          <div className="mt-6 space-y-2 text-center">
            <a href="/forgot-password" className="block text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Forgot Password?
            </a>
            <p className="text-sm text-gray-400">
              Do not have an account?{' '}
              <a href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;