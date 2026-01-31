'use client';

import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
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

    // Simulate API call
    setTimeout(() => {
      // Mock email verification
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-white mb-12 text-center">Reset Password Page</h1>

      {/* Main Card */}
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
          {/* Logo Placeholder */}
          <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
            <span className="text-gray-400 text-xs">LOGO</span>
          </div>

          {/* Card Title */}
          <h2 className="text-2xl font-bold text-white text-center mb-8">Reset Password</h2>

          {/* Email Field */}
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
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Verification Note */}
          <div className="mb-8 p-4 border-2 border-dashed border-orange-500 bg-orange-900/20 rounded-lg">
            <p className="text-orange-300 text-sm text-center">
              The system should verify whether the entered email exists.
            </p>
          </div>

          {/* Submit Button */}
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

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Login
            </a>
          </div>
        </div>

        {/* Success Message (Below Card) */}
        {success && (
          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
            <p className="text-blue-300 text-sm text-center">{success}</p>
            <div className="mt-3 text-center">
              <a href="/login" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                Return to Login →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;