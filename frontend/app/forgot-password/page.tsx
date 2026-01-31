'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/mock-api';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setFieldError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      setFieldError('Please enter a valid email address');
      return false;
    }
    setFieldError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) return;

    setLoading(true);

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Delightful Flamingo</h1>
          <p className="text-gray-400">Reset your password</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-black border border-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Forgot Password</h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900 border border-green-500 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-200 font-medium">Password reset link sent!</p>
                  <p className="text-green-300 text-sm mt-1">
                    Check your email for instructions to reset your password.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-500 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-400 text-sm mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldError('');
                  setError('');
                  setSuccess(false);
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                className={`w-full bg-black border ${
                  fieldError ? 'border-red-500' : 'border-white'
                } rounded py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="Enter your email"
                disabled={loading}
              />
              {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !!fieldError}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center border-t border-gray-700 pt-6">
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg text-center">
          <p className="text-gray-400 text-sm">
            Need help?{' '}
            <a href="mailto:support@rental.com" className="text-blue-400 hover:text-blue-300">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
