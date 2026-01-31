'use client';

import React, { useState } from 'react';

const AdminSettingsPage = () => {
  const [gstPercent, setGstPercent] = useState(18);
  const [scope, setScope] = useState<'admin' | 'vendor'>('admin');
  const [userRole, setUserRole] = useState('admin');
  const [companyData, setCompanyData] = useState({
    gstIn: 'GST123456789',
    address: '123 Business Avenue\nSuite 100\nCity, State 12345'
  });

  const handleGstChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setGstPercent(numValue);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Orders</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Reports</a>
              <a href="#" className="text-white font-medium">Settings</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Admin User</span>
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Settings Menu */}
        <aside className="w-64 bg-gray-900 border-r border-gray-600 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">Settings</h2>
            <nav className="space-y-2">
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Profile</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Change password</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Rental period</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Attributes</a>
              <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Users</a>
              <a href="#" className="block px-4 py-2 bg-pink-600 text-white rounded-lg font-medium">Admin settings</a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
              
              {/* Card Header */}
              <div className="mb-8 border-b border-gray-600 pb-4">
                <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
              </div>

              {/* Top Row */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* GST Percentage */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">GST %</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gstPercent}
                      onChange={(e) => handleGstChange(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>

                {/* Scope Toggle */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Scope</label>
                  <div className="flex bg-gray-700 border border-gray-600 rounded-full p-1">
                    <button
                      onClick={() => setScope('admin')}
                      className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                        scope === 'admin'
                          ? 'bg-pink-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => setScope('vendor')}
                      className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                        scope === 'vendor'
                          ? 'bg-pink-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Vendor
                    </button>
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div className="mb-8 border-b border-gray-600 pb-8">
                <h3 className="text-lg font-semibold text-white mb-6">Company Information</h3>
                
                <div className="grid grid-cols-2 gap-8">
                  {/* Company Logo */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Company Logo</label>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 bg-gray-600 border border-gray-500 rounded mx-auto mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <button className="bg-pink-600 hover:bg-pink-700 text-white text-sm py-1 px-4 rounded-full transition-colors">
                        Upload
                      </button>
                    </div>
                  </div>

                  {/* GST IN and Address */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">GST IN</label>
                      <input
                        type="text"
                        value={companyData.gstIn}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, gstIn: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Address</label>
                      <textarea
                        value={companyData.address}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Selector Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">User Role</h3>
                
                <div className="space-y-3 mb-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="userRole"
                      value="admin"
                      checked={userRole === 'admin'}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500"
                    />
                    <span className="text-white">Admin</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="userRole"
                      value="vendor"
                      checked={userRole === 'vendor'}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500"
                    />
                    <span className="text-white">Vendor</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="userRole"
                      value="customer"
                      checked={userRole === 'customer'}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500"
                    />
                    <span className="text-white">Customer</span>
                  </label>
                </div>

                {/* Note Panel */}
                <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-blue-100 rounded-full p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-blue-100 font-medium text-sm mb-1">Note</h4>
                      <p className="text-blue-200 text-xs">
                        Only Admins can change these settings. Role changes require system administrator approval.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex space-x-4">
                <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full border border-white transition-colors">
                  Save
                </button>
                <button className="bg-transparent border border-gray-600 text-gray-300 py-2 px-6 rounded-full hover:bg-gray-700 transition-colors">
                  Discard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettingsPage;