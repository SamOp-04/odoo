'use client';

import React, { useState } from 'react';

const VendorDashboard = () => {
  const kpiData = {
    totalRentals: 247,
    earnings: 15420,
    activeRentals: 18
  };

  const recentOrders = [
    { id: 'ORD-1001', product: 'MacBook Pro 16"', status: 'confirmed' },
    { id: 'ORD-1002', product: 'Canon EOS R5', status: 'with-customer' },
    { id: 'ORD-1003', product: 'iPad Pro 12.9"', status: 'returned' },
    { id: 'ORD-1004', product: 'Gaming Console', status: 'confirmed' },
    { id: 'ORD-1005', product: 'Smart TV 55"', status: 'with-customer' }
  ];

  const topProducts = [
    { name: 'MacBook Pro 16"', rentals: 45 },
    { name: 'Canon EOS R5', rentals: 38 },
    { name: 'iPad Pro 12.9"', rentals: 32 },
    { name: 'Gaming Console', rentals: 28 },
    { name: 'Smart TV 55"', rentals: 25 }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      'confirmed': 'bg-green-600 border-green-500 text-green-100',
      'with-customer': 'bg-orange-600 border-orange-500 text-orange-100',
      'returned': 'bg-blue-600 border-blue-500 text-blue-100'
    };
    
    const labels = {
      'confirmed': 'Confirmed',
      'with-customer': 'With Customer', 
      'returned': 'Returned'
    };

    return (
      <span className={`px-2 py-1 rounded-full border text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Menu */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Orders</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Reports</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Settings</a>
            </nav>
          </div>

          {/* Right: Vendor Info */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Vendor Name</span>
            <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-sm font-semibold">
              V
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Vertical Menu */}
        <aside className="w-64 bg-gray-900 border-r border-gray-600 min-h-screen">
          <nav className="p-6 space-y-2">
            <a href="#" className="block px-4 py-2 bg-pink-600 text-white rounded-lg font-medium">Dashboard</a>
            <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Products</a>
            <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Orders</a>
            <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Invoices</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
              
              {/* KPI Tiles */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{kpiData.totalRentals}</div>
                  <div className="text-gray-300 mb-3">Total Rentals</div>
                  <span className="px-3 py-1 bg-blue-600 border border-blue-500 text-blue-100 rounded-full text-xs font-medium">
                    All Time
                  </span>
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">${kpiData.earnings.toLocaleString()}</div>
                  <div className="text-gray-300 mb-3">Earnings</div>
                  <span className="px-3 py-1 bg-green-600 border border-green-500 text-green-100 rounded-full text-xs font-medium">
                    This Month
                  </span>
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{kpiData.activeRentals}</div>
                  <div className="text-gray-300 mb-3">Active Rentals</div>
                  <span className="px-3 py-1 bg-orange-600 border border-orange-500 text-orange-100 rounded-full text-xs font-medium">
                    Currently
                  </span>
                </div>
              </div>

              {/* Two Panels */}
              <div className="grid grid-cols-2 gap-8">
                {/* Recent Orders Panel */}
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">Recent Orders</h3>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                        <div>
                          <div className="text-white font-medium text-sm">{order.id}</div>
                          <div className="text-gray-400 text-xs">{order.product}</div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products Panel */}
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">Top Products</h3>
                  <div className="space-y-3">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="text-white text-sm">{product.name}</div>
                        <div className="text-gray-400 text-xs">{product.rentals} rentals</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;