'use client';

import React, { useState } from 'react';

type AppPage = 
  | 'login' | 'signup' | 'forgot-password'
  | 'products' | 'product-detail' | 'cart' | 'checkout' | 'order-confirmation' | 'payment'
  | 'vendor-dashboard' | 'vendor-products' | 'vendor-orders' | 'add-product'
  | 'settings' | 'reports' | 'profile';

interface VendorDashboardProps {
  currentUser?: any;
  onLogout: () => void;
  orders?: any[];
}

const VendorDashboard = ({ currentUser, onLogout, orders = [] }: VendorDashboardProps) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('vendor-dashboard');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('list');

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
  };

  // Sample orders data
  const ordersList = [
    { id: 'S00001', date: 'Jan 22', customer: 'Smith', product: 'TV', total: '$1450', status: 'Sale Order' },
    { id: 'S00006', date: 'Jan 22', customer: 'John', product: 'Projector', total: '$14.50', status: 'Quotation' },
    { id: 'S00010', date: 'Jan 22', customer: 'Mark wood', product: 'Printer', total: '$50', status: 'Sale order Confirmed' },
    { id: 'S00009', date: 'Jan 22', customer: 'Alex', product: 'Car', total: '$775', status: 'Invoiced' },
    { id: 'S00011', date: 'Jan 22', customer: 'Mark wood', product: 'Printer', total: '$150', status: 'Sale Order' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Quotation': return 'bg-purple-600';
      case 'Sale Order': return 'bg-orange-600';
      case 'Sale order Confirmed': return 'bg-teal-500';
      case 'Invoiced': return 'bg-blue-500';
      case 'Sale order cancelled': return 'bg-red-500';
      default: return 'bg-gray-600';
    }
  };
  // Sample data for demonstration
  const recentOrders = [
    { id: 'ORD-001', product: 'Professional Camera', status: 'Confirmed', period: '3 days' },
    { id: 'ORD-002', product: 'Lighting Kit', status: 'With Customer', period: '7 days' },
    { id: 'ORD-003', product: 'Drone Equipment', status: 'Returned', period: '2 days' }
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 text-xs rounded-full font-medium";
    switch (status) {
      case 'Confirmed':
        return `${baseClasses} bg-green-600 text-white`;
      case 'With Customer':
        return `${baseClasses} bg-yellow-600 text-white`;
      case 'Returned':
        return `${baseClasses} bg-gray-600 text-white`;
      default:
        return `${baseClasses} bg-gray-600 text-white`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-white z-10">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold text-white">Your Logo</div>
            <nav className="flex space-x-8">
              <button
                onClick={() => navigateTo('vendor-dashboard')}
                className="text-white font-medium border-b-2 border-white pb-1"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateTo('vendor-products')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => navigateTo('vendor-orders')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Orders
              </button>
              <button
                onClick={() => navigateTo('reports')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Reports
              </button>
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md mx-16">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="w-full bg-black border border-white rounded-full py-2 px-6 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-6">
            {/* Notification Bell */}
            <button className="p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-9-10a5 5 0 1110 0v3.5a5 5 0 01-1.5 3.5l-1.5 1.5v1.5a1 1 0 01-1 1H8a1 1 0 01-1-1v-1.5l-1.5-1.5A5 5 0 014 10.5V7z" />
              </svg>
            </button>
            
            {/* Help Icon */}
            <button className="p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            {/* User Avatar */}
            <button
              onClick={onLogout}
              className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold text-white border border-white hover:bg-purple-700 transition-colors"
              title="Logout"
            >
              {currentUser?.name?.charAt(0) || 'V'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-8">
        {currentPage === 'vendor-dashboard' && (<>
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Vendor Dashboard</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* Total Rentals Card */}
          <div className="bg-black border border-white rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="mb-4">
              <p className="text-5xl font-bold text-white mb-2">156</p>
              <p className="text-gray-400 text-lg">Total Rentals</p>
            </div>
            <div className="text-sm text-gray-500">
              +12% this month
            </div>
          </div>

          {/* Active Rentals Card */}
          <div className="bg-black border border-white rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="mb-4">
              <p className="text-5xl font-bold text-blue-400 mb-2">24</p>
              <p className="text-gray-400 text-lg">Active Rentals</p>
            </div>
            <div className="text-sm text-gray-500">
              Currently ongoing
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-black border border-white rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="mb-4">
              <p className="text-5xl font-bold text-green-400 mb-2">₹2.4L</p>
              <p className="text-gray-400 text-lg">Total Earnings</p>
            </div>
            <div className="text-sm text-gray-500">
              Last 30 days
            </div>
          </div>
        </div>

        {/* Main Wide Card */}
        <div className="max-w-7xl mx-auto bg-black border border-white rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Section: Recent Rental Orders */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Rental Orders</h2>
              
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-6 mb-4 pb-3 border-b border-white">
                <div className="text-gray-400 font-medium">Order ID</div>
                <div className="text-gray-400 font-medium">Product</div>
                <div className="text-gray-400 font-medium">Status</div>
                <div className="text-gray-400 font-medium">Rental Period</div>
              </div>

              {/* Table Rows */}
              <div className="space-y-0">
                {recentOrders.map((order, index) => (
                  <div key={order.id} className={`grid grid-cols-4 gap-6 py-4 ${index < recentOrders.length - 1 ? 'border-b border-white' : ''}`}>
                    <div className="text-white font-medium">{order.id}</div>
                    <div className="text-white">{order.product}</div>
                    <div>
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-gray-400">{order.period}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section: Quick Insights */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Insights</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-400 text-sm">Most Rented Product</p>
                      <p className="text-white font-medium">Professional Camera</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-400 text-sm">Upcoming Returns</p>
                      <p className="text-white font-medium">8 orders due today</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-400 text-sm">Late Returns Count</p>
                      <p className="text-red-400 font-medium">3 overdue</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>)}

        {currentPage === 'vendor-products' && (
          <>
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white">My Rental Products</h1>
            </div>

            {/* Main Card */}
            <div className="max-w-7xl mx-auto bg-black border border-white rounded-lg p-8">
              {/* Add Product Button */}
              <div className="flex justify-end mb-8">
                <button 
                  onClick={() => navigateTo('add-product')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
                >
                  Add Product
                </button>
              </div>

              {/* Product Table */}
              <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-6 mb-6 pb-4 border-b border-white">
                  <div className="text-gray-400 font-medium">Product</div>
                  <div className="text-gray-400 font-medium">Rentable</div>
                  <div className="text-gray-400 font-medium">Quantity Available</div>
                  <div className="text-gray-400 font-medium">Rental Price</div>
                  <div className="text-gray-400 font-medium">Status</div>
                  <div className="text-gray-400 font-medium">Actions</div>
                </div>

                {/* Product Rows */}
                <div className="space-y-0">
                  {/* Product 1 */}
                  <div className="grid grid-cols-6 gap-6 py-6 border-b border-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">IMG</span>
                      </div>
                      <span className="text-white font-medium">Professional Camera Kit</span>
                    </div>
                    <div>
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-black border border-white text-green-400">
                        Yes
                      </span>
                    </div>
                    <div className="text-white">5 units</div>
                    <div className="text-white">₹500 / Day</div>
                    <div>
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-black border border-white text-green-400">
                        Published
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-xs rounded-full font-medium bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-xs rounded-full font-medium bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">
                        Unpublish
                      </button>
                    </div>
                  </div>

                  {/* Product 2 */}
                  <div className="grid grid-cols-6 gap-6 py-6 border-b border-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">IMG</span>
                      </div>
                      <span className="text-white font-medium">Drone Equipment Set</span>
                    </div>
                    <div>
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-black border border-white text-green-400">
                        Yes
                      </span>
                    </div>
                    <div className="text-white">3 units</div>
                    <div className="text-white">₹800 / Day</div>
                    <div>
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-black border border-white text-gray-400">
                        Unpublished
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-xs rounded-full font-medium bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-xs rounded-full font-medium bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">
                        Publish
                      </button>
                    </div>
                  </div>

                  {/* Product 3 */}
                  <div className="grid grid-cols-6 gap-6 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">IMG</span>
                      </div>
                      <span className="text-white font-medium">Studio Lighting Kit</span>
                    </div>
                    <div>
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-black border border-white text-red-400">
                        No
                      </span>
                    </div>
                    <div className="text-white">0 units</div>
                    <div className="text-white">₹300 / Day</div>
                    <div>
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-black border border-white text-green-400">
                        Published
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-xs rounded-full font-medium bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-xs rounded-full font-medium bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">
                        Unpublish
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentPage === 'vendor-orders' && (
          <>
            {/* Orders Content */}
            <div className="flex">
              {/* Left Sidebar - Rental Status */}
              <div className="w-56 pr-6 border-r border-white">
                <div className="bg-black border border-white rounded-lg p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white">
                    <h2 className="text-white font-semibold">Rental Status</h2>
                    <button className="text-gray-400 hover:text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Status Counts */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Total:</span>
                      <span className="text-white font-bold">{ordersList.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Sale order</span>
                      <span className="text-white">{ordersList.filter(o => o.status === 'Sale Order').length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Quotation</span>
                      <span className="text-white">{ordersList.filter(o => o.status === 'Quotation').length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Invoiced</span>
                      <span className="text-white">{ordersList.filter(o => o.status === 'Invoiced').length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Confirmed</span>
                      <span className="text-white">{ordersList.filter(o => o.status === 'Sale order Confirmed').length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Cancelled</span>
                      <span className="text-white">{ordersList.filter(o => o.status === 'Sale order cancelled').length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 pl-6">
                {/* Top Controls */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Export Dropdown */}
                    <div className="relative group">
                      <button className="px-4 py-2 bg-black border border-white rounded text-white hover:bg-gray-900 transition-colors">
                        Export Records ▼
                      </button>
                      <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-black border border-white rounded shadow-lg z-10">
                        <button className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800">For CSV, excel</button>
                        <button className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800">Imports & exports</button>
                      </div>
                    </div>

                    {/* New Button */}
                    <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors">
                      New
                    </button>
                  </div>

                  {/* Search and View Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white w-48"
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    {/* Filters Button */}
                    <button className="px-4 py-2 bg-black border border-white rounded text-white hover:bg-gray-900 transition-colors">
                      Filters
                    </button>

                    {/* View Switcher */}
                    <div className="flex border border-white rounded overflow-hidden">
                      <button 
                        onClick={() => setViewMode('kanban')}
                        className={`px-3 py-2 ${viewMode === 'kanban' ? 'bg-purple-600' : 'bg-black hover:bg-gray-900'} text-white transition-colors`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 ${viewMode === 'list' ? 'bg-purple-600' : 'bg-black hover:bg-gray-900'} text-white border-l border-white transition-colors`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conditional View Rendering */}
                {viewMode === 'list' ? (
                  /* List View */
                  <div className="bg-black border border-white rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-900 border-b border-white">
                      <div className="text-gray-400 font-medium text-sm">Order Reference</div>
                      <div className="text-gray-400 font-medium text-sm">Order Date</div>
                      <div className="text-gray-400 font-medium text-sm">Customer Name</div>
                      <div className="text-gray-400 font-medium text-sm">Product</div>
                      <div className="text-gray-400 font-medium text-sm">Total</div>
                      <div className="text-gray-400 font-medium text-sm">Rental Status</div>
                    </div>

                    {/* Table Rows */}
                    <div>
                      {ordersList.map((order) => (
                        <div key={order.id} className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-900 transition-colors">
                          <div className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-white">{order.id}</span>
                          </div>
                          <div className="text-white">{order.date}</div>
                          <div className="text-white">{order.customer}</div>
                          <div className="text-white">{order.product}</div>
                          <div className="text-white">{order.total}</div>
                          <div>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)} text-white`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Kanban View */
                  <div className="flex gap-6 overflow-x-auto pb-4">
                    {/* Quotation Column */}
                    <div className="flex-shrink-0 w-80">
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
                          <h3 className="text-white font-semibold">Quotation</h3>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {ordersList.filter(o => o.status === 'Quotation').map((order) => (
                          <div key={order.id} className="bg-black border border-white rounded-lg p-4 hover:border-purple-600 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-white font-medium">{order.id}</span>
                              <span className="text-gray-400 text-sm">{order.date}</span>
                            </div>
                            <div className="text-white mb-1">{order.customer}</div>
                            <div className="text-gray-400 text-sm mb-2">{order.product}</div>
                            <div className="text-white font-semibold">{order.total}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sale Order Column */}
                    <div className="flex-shrink-0 w-80">
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full bg-orange-600 mr-2"></div>
                          <h3 className="text-white font-semibold">Sale Order</h3>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {ordersList.filter(o => o.status === 'Sale Order').map((order) => (
                          <div key={order.id} className="bg-black border border-white rounded-lg p-4 hover:border-orange-600 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-white font-medium">{order.id}</span>
                              <span className="text-gray-400 text-sm">{order.date}</span>
                            </div>
                            <div className="text-white mb-1">{order.customer}</div>
                            <div className="text-gray-400 text-sm mb-2">{order.product}</div>
                            <div className="text-white font-semibold">{order.total}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sale Order Confirmed Column */}
                    <div className="flex-shrink-0 w-80">
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                          <h3 className="text-white font-semibold">Sale order Confirmed</h3>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {ordersList.filter(o => o.status === 'Sale order Confirmed').map((order) => (
                          <div key={order.id} className="bg-black border border-white rounded-lg p-4 hover:border-teal-500 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-white font-medium">{order.id}</span>
                              <span className="text-gray-400 text-sm">{order.date}</span>
                            </div>
                            <div className="text-white mb-1">{order.customer}</div>
                            <div className="text-gray-400 text-sm mb-2">{order.product}</div>
                            <div className="text-white font-semibold">{order.total}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Invoiced Column */}
                    <div className="flex-shrink-0 w-80">
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <h3 className="text-white font-semibold">Invoiced</h3>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {ordersList.filter(o => o.status === 'Invoiced').map((order) => (
                          <div key={order.id} className="bg-black border border-white rounded-lg p-4 hover:border-blue-500 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-white font-medium">{order.id}</span>
                              <span className="text-gray-400 text-sm">{order.date}</span>
                            </div>
                            <div className="text-white mb-1">{order.customer}</div>
                            <div className="text-gray-400 text-sm mb-2">{order.product}</div>
                            <div className="text-white font-semibold">{order.total}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sale order cancelled Column */}
                    <div className="flex-shrink-0 w-80">
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <h3 className="text-white font-semibold">Sale order cancelled</h3>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {ordersList.filter(o => o.status === 'Sale order cancelled').map((order) => (
                          <div key={order.id} className="bg-black border border-white rounded-lg p-4 hover:border-red-500 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-white font-medium">{order.id}</span>
                              <span className="text-gray-400 text-sm">{order.date}</span>
                            </div>
                            <div className="text-white mb-1">{order.customer}</div>
                            <div className="text-gray-400 text-sm mb-2">{order.product}</div>
                            <div className="text-white font-semibold">{order.total}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {currentPage === 'reports' && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Reports</h1>
            <p className="text-gray-400">Reports page coming soon...</p>
          </div>
        )}

        {currentPage === 'add-product' && (
          <>
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white">Add / Edit Product</h1>
            </div>

            {/* Main Form Card */}
            <div className="max-w-6xl mx-auto bg-black border border-white rounded-lg p-12">
              {/* Two Column Form Layout */}
              <div className="grid grid-cols-2 gap-x-16 gap-y-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Category
                    </label>
                    <select className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-white">
                      <option value="">Select category</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="vehicles">Vehicles</option>
                      <option value="equipment">Equipment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Quantity on Hand */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Quantity on Hand
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  {/* Cost Price */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Cost Price
                    </label>
                    <input
                      type="number"
                      placeholder="₹0.00"
                      className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  {/* Sales Price */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Sales Price
                    </label>
                    <input
                      type="number"
                      placeholder="₹0.00"
                      className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Rentable Toggle */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Rentable
                    </label>
                    <div className="flex items-center">
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                      <span className="ml-3 text-gray-400 text-sm">Yes</span>
                    </div>
                  </div>

                  {/* Rental Pricing Section */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-4">
                      Rental Pricing
                    </label>
                    <div className="space-y-4 pl-4 border-l-2 border-gray-700">
                      {/* Hourly Price */}
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Hourly Price
                        </label>
                        <input
                          type="number"
                          placeholder="₹0.00"
                          className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                      </div>

                      {/* Daily Price */}
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Daily Price
                        </label>
                        <input
                          type="number"
                          placeholder="₹0.00"
                          className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                      </div>

                      {/* Weekly Price */}
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Weekly Price
                        </label>
                        <input
                          type="number"
                          placeholder="₹0.00"
                          className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Publish / Unpublish Toggle */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Publish / Unpublish
                    </label>
                    <div className="flex items-center">
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                      </button>
                      <span className="ml-3 text-gray-400 text-sm">Unpublished</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div className="border-t border-white my-8"></div>

              {/* Action Buttons - Bottom Right */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => navigateTo('vendor-products')}
                  className="px-8 py-2.5 bg-black border border-white text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save logic here
                    navigateTo('vendor-products');
                  }}
                  className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium"
                >
                  Save Product
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;