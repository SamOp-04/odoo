'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/mock-api';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const token = params.token;

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    const errors = { ...fieldErrors };

    if (name === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else {
        delete errors.password;
      }
      // Revalidate confirm password
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      } else if (formData.confirmPassword) {
        delete errors.confirmPassword;
      }
    }

    if (name === 'confirmPassword') {
      if (!value) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (value !== formData.password) {
        errors.confirmPassword = 'Passwords do not match';
      } else {
        delete errors.confirmPassword;
      }
    }

    setFieldErrors(errors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
    setError('');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await resetPassword(token, formData.password, formData.confirmPassword);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-green-900 border border-green-500 rounded-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Password Updated!</h2>
            <p className="text-green-200 mb-4">Your password has been successfully changed.</p>
            <p className="text-green-300 text-sm">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Delightful Flamingo</h1>
          <p className="text-gray-400">Create a new password</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-black border border-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Reset Password</h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Enter your new password below.
          </p>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-500 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-gray-400 text-sm mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={(e) => validateField('password', e.target.value)}
                  className={`w-full bg-black border ${
                    fieldErrors.password ? 'border-red-500' : 'border-white'
                  } rounded py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">Must be at least 8 characters</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-400 text-sm mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={(e) => validateField('confirmPassword', e.target.value)}
                  className={`w-full bg-black border ${
                    fieldErrors.confirmPassword ? 'border-red-500' : 'border-white'
                  } rounded py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || Object.keys(fieldErrors).length > 0 || !formData.password || !formData.confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Token Info (for testing) */}
        {token === 'invalid' && (
          <div className="mt-6 p-4 bg-yellow-900 border border-yellow-500 rounded-lg">
            <p className="text-yellow-200 text-sm">
              ⚠️ This reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
