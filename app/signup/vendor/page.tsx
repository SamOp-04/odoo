'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupVendor, validateCouponCode } from '@/lib/mock-api';
import { Eye, EyeOff, Loader2, CheckCircle, Tag } from 'lucide-react';

export default function VendorSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gstin: '',
    password: '',
    confirmPassword: '',
    couponCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [couponValid, setCouponValid] = useState<{ valid: boolean; discount?: number } | null>(null);

  const validateField = (name: string, value: string) => {
    const errors = { ...fieldErrors };

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'First name is required';
        } else {
          delete errors.firstName;
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Last name is required';
        } else {
          delete errors.lastName;
        }
        break;

      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else if (value.toLowerCase().includes('@existing.com')) {
          errors.email = 'Email already exists';
        } else {
          delete errors.email;
        }
        break;

      case 'gstin':
        if (!value.trim()) {
          errors.gstin = 'GSTIN is required';
        } else if (value.length !== 15) {
          errors.gstin = 'GSTIN must be exactly 15 characters';
        } else {
          delete errors.gstin;
        }
        break;

      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else {
          delete errors.password;
        }
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword) {
          delete errors.confirmPassword;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
    }

    setFieldErrors(errors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name !== 'couponCode') {
      validateField(name, value);
    }
    setError('');
  };

  const handleCouponBlur = () => {
    if (formData.couponCode.trim()) {
      const result = validateCouponCode(formData.couponCode);
      setCouponValid(result);
    } else {
      setCouponValid(null);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.gstin.trim()) {
      errors.gstin = 'GSTIN is required';
    } else if (formData.gstin.length !== 15) {
      errors.gstin = 'GSTIN must be exactly 15 characters';
    }
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
      const response = await signupVendor(formData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(response.message || 'Signup failed. Please try again.');
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
            <h2 className="text-2xl font-bold text-white mb-2">Vendor Account Created!</h2>
            <p className="text-green-200 mb-4">Your account is pending approval.</p>
            <p className="text-green-300 text-sm">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Delightful Flamingo</h1>
          <p className="text-gray-400">Become a Vendor</p>
        </div>

        {/* Signup Card */}
        <div className="bg-black border border-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Vendor Sign Up</h2>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-500 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-gray-400 text-sm mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={(e) => validateField('firstName', e.target.value)}
                className={`w-full bg-black border ${
                  fieldErrors.firstName ? 'border-red-500' : 'border-white'
                } rounded py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="Enter your first name"
                disabled={loading}
              />
              {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-gray-400 text-sm mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={(e) => validateField('lastName', e.target.value)}
                className={`w-full bg-black border ${
                  fieldErrors.lastName ? 'border-red-500' : 'border-white'
                } rounded py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="Enter your last name"
                disabled={loading}
              />
              {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-400 text-sm mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={(e) => validateField('email', e.target.value)}
                className={`w-full bg-black border ${
                  fieldErrors.email ? 'border-red-500' : 'border-white'
                } rounded py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="Enter your email"
                disabled={loading}
              />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            {/* GSTIN */}
            <div>
              <label htmlFor="gstin" className="block text-gray-400 text-sm mb-2">
                GSTIN <span className="text-red-500">*</span>
              </label>
              <input
                id="gstin"
                name="gstin"
                type="text"
                value={formData.gstin}
                onChange={handleChange}
                onBlur={(e) => validateField('gstin', e.target.value)}
                maxLength={15}
                className={`w-full bg-black border ${
                  fieldErrors.gstin ? 'border-red-500' : 'border-white'
                } rounded py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="Enter 15-character GSTIN"
                disabled={loading}
              />
              {fieldErrors.gstin ? (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.gstin}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">
                  {formData.gstin.length}/15 characters
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-400 text-sm mb-2">
                Password <span className="text-red-500">*</span>
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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-400 text-sm mb-2">
                Confirm Password <span className="text-red-500">*</span>
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
                  placeholder="Confirm your password"
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

            {/* Coupon Code */}
            <div>
              <label htmlFor="couponCode" className="block text-gray-400 text-sm mb-2">
                Coupon Code <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  id="couponCode"
                  name="couponCode"
                  type="text"
                  value={formData.couponCode}
                  onChange={handleChange}
                  onBlur={handleCouponBlur}
                  className="w-full bg-black border border-white rounded py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter coupon code"
                  disabled={loading}
                />
                {couponValid && couponValid.valid && (
                  <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {couponValid?.valid && (
                <div className="mt-2 p-2 bg-green-900 border border-green-500 rounded flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-green-200 text-sm font-medium">{couponValid.discount}% discount applied!</p>
                </div>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading || Object.keys(fieldErrors).length > 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Vendor Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Login
              </Link>
            </p>
          </div>

          {/* Regular Signup Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Not a vendor?{' '}
              <Link href="/signup" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                Regular Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
