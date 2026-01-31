'use client';

import React from 'react';

const CartQuotationPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Condition</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About us</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, categories, or rentals..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-6">
            {/* Notification */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5m0-10V7a4 4 0 00-8 0v5.586l-1.293 1.293A1 1 0 003 15h3m5 2v1a2 2 0 11-4 0v-1m4 0H9" />
              </svg>
            </button>
            
            {/* Cart */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </button>
            
            {/* User Avatar */}
            <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
              U
            </button>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-white">Cart / Quotation Page</h1>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 pb-12">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
          {/* Status Label */}
          <div className="mb-6">
            <span className="bg-yellow-600 text-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
              Quotation: Draft
            </span>
          </div>

          {/* Product List Table */}
          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 pb-4 border-b border-gray-600 text-gray-400 text-sm font-medium">
              <div>Product</div>
              <div>Rental Duration</div>
              <div>Quantity</div>
              <div>Rental Price</div>
              <div>Deposit Amount</div>
              <div>Total Amount</div>
              <div>Actions</div>
            </div>

            {/* Product Rows */}
            <div className="space-y-0">
              {/* Product Row 1 */}
              <div className="grid grid-cols-7 gap-4 py-4 border-b border-gray-700 items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-600 rounded border border-gray-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <span className="text-white">MacBook Pro 16"</span>
                </div>
                <div className="text-gray-300 text-sm">
                  Feb 1, 2026 9:00 AM – Feb 15, 2026 6:00 PM
                </div>
                <div className="flex items-center space-x-2">
                  <button className="w-6 h-6 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600">-</button>
                  <span className="w-8 text-center text-white">2</span>
                  <button className="w-6 h-6 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600">+</button>
                </div>
                <div className="text-white">$150/day</div>
                <div className="text-white">$500</div>
                <div className="text-white font-semibold">$4,600</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-transparent border border-white text-white rounded-full text-xs hover:bg-gray-700">
                    Update Dates
                  </button>
                  <button className="px-3 py-1 bg-transparent border border-red-500 text-red-500 rounded-full text-xs hover:bg-red-500 hover:text-white">
                    Remove Item
                  </button>
                </div>
              </div>

              {/* Product Row 2 */}
              <div className="grid grid-cols-7 gap-4 py-4 border-b border-gray-700 items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-600 rounded border border-gray-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white">Canon EOS R5</span>
                </div>
                <div className="text-gray-300 text-sm">
                  Feb 5, 2026 10:00 AM – Feb 10, 2026 8:00 PM
                </div>
                <div className="flex items-center space-x-2">
                  <button className="w-6 h-6 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600">-</button>
                  <span className="w-8 text-center text-white">1</span>
                  <button className="w-6 h-6 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600">+</button>
                </div>
                <div className="text-white">$80/day</div>
                <div className="text-white">$300</div>
                <div className="text-white font-semibold">$880</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-transparent border border-white text-white rounded-full text-xs hover:bg-gray-700">
                    Update Dates
                  </button>
                  <button className="px-3 py-1 bg-transparent border border-red-500 text-red-500 rounded-full text-xs hover:bg-red-500 hover:text-white">
                    Remove Item
                  </button>
                </div>
              </div>

              {/* Product Row 3 */}
              <div className="grid grid-cols-7 gap-4 py-4 items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-600 rounded border border-gray-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white">iPad Pro 12.9"</span>
                </div>
                <div className="text-gray-300 text-sm">
                  Feb 3, 2026 2:00 PM – Feb 12, 2026 5:00 PM
                </div>
                <div className="flex items-center space-x-2">
                  <button className="w-6 h-6 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600">-</button>
                  <span className="w-8 text-center text-white">3</span>
                  <button className="w-6 h-6 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600">+</button>
                </div>
                <div className="text-white">$45/day</div>
                <div className="text-white">$200</div>
                <div className="text-white font-semibold">$1,815</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-transparent border border-white text-white rounded-full text-xs hover:bg-gray-700">
                    Update Dates
                  </button>
                  <button className="px-3 py-1 bg-transparent border border-red-500 text-red-500 rounded-full text-xs hover:bg-red-500 hover:text-white">
                    Remove Item
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-8 flex justify-end">
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 w-80">
              {/* Summary Details */}
              <div className="space-y-3 text-right">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="text-white">$7,295</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Deposit:</span>
                  <span className="text-white">$1,000</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-bold text-lg">Grand Total:</span>
                    <span className="text-white font-bold text-lg">$8,295</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full border border-white transition-colors">
                Confirm Quotation
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Notice */}
      <footer className="text-center pb-8">
        <p className="text-gray-400 text-sm">
          Need to change something? Use 'Update Dates' or 'Remove Item' per product.
        </p>
      </footer>
    </div>
  );
};

export default CartQuotationPage;