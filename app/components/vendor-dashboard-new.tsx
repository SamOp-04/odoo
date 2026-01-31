'use client';

import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface VendorDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const VendorDashboard = ({ currentUser, onLogout }: VendorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="w-16 h-8 bg-gray-700 border border-gray-500 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">Your Logo</span>
            </div>
            <nav className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`${activeTab === 'overview' ? 'text-white' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`${activeTab === 'products' ? 'text-white' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                Products
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`${activeTab === 'orders' ? 'text-white' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                Orders
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`${activeTab === 'analytics' ? 'text-white' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {currentUser.name}</span>
            <button
              onClick={onLogout}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
            <p className="text-gray-400">Manage your products and sales</p>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Total Products</h3>
                <p className="text-3xl text-pink-500 font-bold">24</p>
                <p className="text-gray-400 text-sm">+3 this month</p>
              </div>
              
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Active Rentals</h3>
                <p className="text-3xl text-green-500 font-bold">12</p>
                <p className="text-gray-400 text-sm">+5 this week</p>
              </div>
              
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Monthly Revenue</h3>
                <p className="text-3xl text-blue-500 font-bold">$2,450</p>
                <p className="text-gray-400 text-sm">+15% from last month</p>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Products</h2>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Add New Product
                </button>
              </div>
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">Product Management Coming Soon</div>
                <p className="text-gray-500">Manage your inventory, pricing, and product details</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">Order Management Coming Soon</div>
                <p className="text-gray-500">View and manage customer orders and rentals</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">Analytics Dashboard Coming Soon</div>
                <p className="text-gray-500">View detailed sales reports and performance metrics</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;