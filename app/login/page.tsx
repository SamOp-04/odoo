'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/mock-api';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!loginId.trim()) {
      errors.loginId = 'Login ID is required';
    } else if (!/\S+@\S+\.\S+/.test(loginId)) {
      errors.loginId = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await login(loginId, password);

      if (response.success && response.user) {
        // Role-based redirect
        switch (response.user.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'vendor':
            router.push('/vendor/dashboard');
            break;
          case 'user':
          default:
            router.push('/');
            break;
        }
      } else {
        setError(response.message || 'Login failed. Please try again.');
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
          <p className="text-gray-400">24-Hour Rental Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-black border border-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-500 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login ID */}
            <div>
              <label htmlFor="loginId" className="block text-gray-400 text-sm mb-2">
                Login ID
              </label>
              <input
                id="loginId"
                type="text"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  setFieldErrors({ ...fieldErrors, loginId: '' });
                  setError('');
                }}
                className={`w-full bg-black border ${
                  fieldErrors.loginId ? 'border-red-500' : 'border-white'
                } rounded py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="Enter your email"
                disabled={loading}
              />
              {fieldErrors.loginId && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.loginId}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-400 text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors({ ...fieldErrors, password: '' });
                    setError('');
                  }}
                  className={`w-full bg-black border ${
                    fieldErrors.password ? 'border-red-500' : 'border-white'
                  } rounded py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Enter your password"
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
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Test Credentials */}
        <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <p className="text-gray-400 text-xs mb-2 font-semibold">Test Credentials:</p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Admin: admin@rental.com / admin123</p>
            <p>Vendor: vendor@rental.com / vendor123</p>
            <p>User: user321@rental.com / userisg123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
