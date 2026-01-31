'use client';

import React, { useState } from 'react';

const ReportsDashboard = () => {
  const [selectedCriteria, setSelectedCriteria] = useState('revenue');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [selectedVendor, setSelectedVendor] = useState('All vendors');

  // Sample data for charts
  const revenueData = [
    { product: 'Cameras', revenue: 45000 },
    { product: 'Audio Equipment', revenue: 32000 },
    { product: 'Lighting', revenue: 28000 },
    { product: 'Drones', revenue: 15000 },
    { product: 'Accessories', revenue: 12000 }
  ];

  const ordersData = [
    { period: 'Week 1', orders: 45 },
    { period: 'Week 2', orders: 52 },
    { period: 'Week 3', orders: 38 },
    { period: 'Week 4', orders: 61 },
    { period: 'Week 5', orders: 47 }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
  const maxOrders = Math.max(...ordersData.map(d => d.orders));

  const BarChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Revenue by Product</h3>
        <span className="text-sm text-gray-400">Revenue by product (Rs)</span>
      </div>
      
      <div className="space-y-3">
        {revenueData.map((item, index) => {
          const width = (item.revenue / maxRevenue) * 100;
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-24 text-sm text-gray-300 text-right">{item.product}</div>
              <div className="flex-1 relative">
                <div className="h-8 bg-gray-700 border border-gray-600 rounded relative overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 border-r border-white transition-all duration-300"
                    style={{ width: `${width}%` }}
                  ></div>
                </div>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white font-medium">
                  ₹{item.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const LineChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Orders Over Time</h3>
        <span className="text-sm text-gray-400">Orders over time</span>
      </div>
      
      <div className="relative h-64 bg-gray-750 border border-gray-600 rounded p-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
          <span>{maxOrders}</span>
          <span>{Math.round(maxOrders * 0.75)}</span>
          <span>{Math.round(maxOrders * 0.5)}</span>
          <span>{Math.round(maxOrders * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y * 2}
                x2="400"
                y2={y * 2}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}

            {/* Line path */}
            <path
              d={ordersData.map((point, index) => {
                const x = (index / (ordersData.length - 1)) * 380 + 10;
                const y = 180 - (point.orders / maxOrders) * 160;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              className="drop-shadow-sm"
            />

            {/* Data points */}
            {ordersData.map((point, index) => {
              const x = (index / (ordersData.length - 1)) * 380 + 10;
              const y = 180 - (point.orders / maxOrders) * 160;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-400 mt-2">
          {ordersData.map((point, index) => (
            <span key={index} className="transform -rotate-45 origin-top-left">
              {point.period}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Orders</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-white font-medium">Reports</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Settings</a>
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

      <div className="relative p-8">
        {/* Export Buttons - Top Right */}
        <div className="absolute top-8 right-8 flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 bg-gray-700 border border-gray-500 rounded hover:bg-gray-600 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
            <span className="text-xs text-gray-400">PDF</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 bg-gray-700 border border-gray-500 rounded hover:bg-gray-600 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </button>
            <span className="text-xs text-gray-400">Import</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 bg-gray-700 border border-gray-500 rounded hover:bg-gray-600 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>
            <span className="text-xs text-gray-400">Excel & CSV</span>
          </div>
        </div>

        {/* Main Reports Card */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 mr-32">
          {/* Card Header with Filters */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {/* Left: Title and Gear Icon */}
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-white">Reports</h1>
                <button className="w-6 h-6 text-gray-400 hover:text-white transition-colors">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              {/* Right: Filter Controls */}
              <div className="flex items-center space-x-4">
                {/* Criteria Dropdown */}
                <select
                  value={selectedCriteria}
                  onChange={(e) => setSelectedCriteria(e.target.value)}
                  className="bg-pink-600 text-white px-4 py-2 rounded-full border border-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 hover:bg-pink-700 transition-colors"
                >
                  <option value="revenue">Revenue by product</option>
                  <option value="orders">Orders over time</option>
                </select>

                {/* Date Range */}
                <button
                  onClick={() => setDateRange(dateRange === 'Last 30 days' ? 'Last 7 days' : 'Last 30 days')}
                  className="bg-gray-700 text-white px-4 py-2 rounded-full border border-gray-500 text-sm flex items-center space-x-2 hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{dateRange}</span>
                </button>

                {/* Vendor Dropdown */}
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-full border border-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 hover:bg-gray-600 transition-colors"
                >
                  <option value="All vendors">All vendors</option>
                  <option value="Vendor 1">Vendor 1</option>
                  <option value="Vendor 2">Vendor 2</option>
                  <option value="Vendor 3">Vendor 3</option>
                </select>

                {/* Apply Filters Button */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full border border-white text-sm font-medium transition-colors">
                  Apply filters
                </button>
              </div>
            </div>
          </div>

          {/* Charts Area */}
          <div className="bg-gray-750 border border-gray-600 rounded-lg p-6">
            {selectedCriteria === 'revenue' ? <BarChart /> : <LineChart />}
          </div>

          {/* Chart Statistics */}
          <div className="mt-6 grid grid-cols-3 gap-6">
            <div className="bg-gray-750 border border-gray-600 rounded-lg p-4">
              <div className="text-sm text-gray-400">Total Revenue</div>
              <div className="text-2xl font-bold text-white">₹{revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</div>
              <div className="text-xs text-green-400">+12% from last period</div>
            </div>
            <div className="bg-gray-750 border border-gray-600 rounded-lg p-4">
              <div className="text-sm text-gray-400">Total Orders</div>
              <div className="text-2xl font-bold text-white">{ordersData.reduce((sum, item) => sum + item.orders, 0)}</div>
              <div className="text-xs text-green-400">+8% from last period</div>
            </div>
            <div className="bg-gray-750 border border-gray-600 rounded-lg p-4">
              <div className="text-sm text-gray-400">Average Order Value</div>
              <div className="text-2xl font-bold text-white">₹{Math.round(revenueData.reduce((sum, item) => sum + item.revenue, 0) / ordersData.reduce((sum, item) => sum + item.orders, 0)).toLocaleString()}</div>
              <div className="text-xs text-green-400">+5% from last period</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;