'use client';

import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const AdminDashboard = ({ currentUser, onLogout }: AdminDashboardProps) => {
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
                onClick={() => setActiveTab('users')}
                className={`${activeTab === 'users' ? 'text-white' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                Users
              </button>
              <button 
                onClick={() => setActiveTab('vendors')}
                className={`${activeTab === 'vendors' ? 'text-white' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                Vendors
              </button>
              <button 
                onClick={() => setActiveTab('system')}
                className={`${activeTab === 'system' ? 'text-white' : 'text-gray-300'} hover:text-white transition-colors`}
              >
                System
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
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">System administration and management</p>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Total Users</h3>
                <p className="text-3xl text-blue-500 font-bold">1,234</p>
                <p className="text-gray-400 text-sm">+45 this month</p>
              </div>
              
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Active Vendors</h3>
                <p className="text-3xl text-green-500 font-bold">89</p>
                <p className="text-gray-400 text-sm">+7 this week</p>
              </div>
              
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Total Orders</h3>
                <p className="text-3xl text-purple-500 font-bold">5,678</p>
                <p className="text-gray-400 text-sm">+123 today</p>
              </div>
              
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">System Health</h3>
                <p className="text-3xl text-green-500 font-bold">99.9%</p>
                <p className="text-gray-400 text-sm">Uptime</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Add New User
                </button>
              </div>
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">User Management Coming Soon</div>
                <p className="text-gray-500">Manage customer accounts, roles, and permissions</p>
              </div>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Vendor Management</h2>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Approve Vendor
                </button>
              </div>
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">Vendor Management Coming Soon</div>
                <p className="text-gray-500">Approve vendors, manage commissions, and review performance</p>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">System Configuration</h2>
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">System Settings Coming Soon</div>
                <p className="text-gray-500">Configure platform settings, fees, and system parameters</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;