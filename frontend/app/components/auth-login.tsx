'use client';

import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'vendor' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Mock users for demo
  const mockUsers = {
    customer: {
      id: 'customer-1',
      name: 'John Customer',
      email: 'customer@example.com',
      role: 'customer' as const
    },
    vendor: {
      id: 'vendor-1', 
      name: 'Jane Vendor',
      email: 'vendor@example.com',
      role: 'vendor' as const
    },
    admin: {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const
    }
  };

  const handleLogin = () => {
    const user = mockUsers[selectedRole];
    onLogin({
      ...user,
      name: name || user.name,
      email: email || user.email
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-8 bg-gray-700 border border-gray-500 rounded flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-xs">Your Logo</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedRole('customer')}
              className={`p-3 rounded-lg border text-center transition-colors ${
                selectedRole === 'customer'
                  ? 'bg-pink-600 border-pink-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-sm font-medium">Customer</div>
              <div className="text-xs opacity-75">Shop & Rent</div>
            </button>
            <button
              onClick={() => setSelectedRole('vendor')}
              className={`p-3 rounded-lg border text-center transition-colors ${
                selectedRole === 'vendor'
                  ? 'bg-pink-600 border-pink-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-sm font-medium">Vendor</div>
              <div className="text-xs opacity-75">Sell Products</div>
            </button>
            <button
              onClick={() => setSelectedRole('admin')}
              className={`p-3 rounded-lg border text-center transition-colors ${
                selectedRole === 'admin'
                  ? 'bg-pink-600 border-pink-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs opacity-75">Manage System</div>
            </button>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mockUsers[selectedRole].name}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mockUsers[selectedRole].email}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg border border-white transition-colors"
        >
          Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </button>

        {/* Role Description */}
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-sm font-medium text-gray-200 mb-2">
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Access:
          </h3>
          <ul className="text-xs text-gray-400 space-y-1">
            {selectedRole === 'customer' && (
              <>
                <li>• Browse and search products</li>
                <li>• Add items to cart and checkout</li>
                <li>• Manage rental bookings</li>
                <li>• View order history</li>
              </>
            )}
            {selectedRole === 'vendor' && (
              <>
                <li>• Manage product listings</li>
                <li>• View sales analytics</li>
                <li>• Process customer orders</li>
                <li>• Manage inventory</li>
              </>
            )}
            {selectedRole === 'admin' && (
              <>
                <li>• Manage all users and vendors</li>
                <li>• View system analytics</li>
                <li>• Moderate content and reviews</li>
                <li>• Configure system settings</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;