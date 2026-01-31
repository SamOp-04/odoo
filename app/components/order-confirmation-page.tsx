'use client';

import React, { useState } from 'react';

const OrderConfirmationPage = () => {
  const [status, setStatus] = useState<'pending' | 'confirmed'>('pending');
  const [notes, setNotes] = useState('');

  const orderItems = [
    { 
      id: 1, 
      name: 'MacBook Pro 16"', 
      quantity: 2, 
      duration: 'Feb 1-15, 2026', 
      total: 4600,
      thumbnail: 'laptop'
    },
    { 
      id: 2, 
      name: 'Canon EOS R5', 
      quantity: 1, 
      duration: 'Feb 5-10, 2026', 
      total: 880,
      thumbnail: 'camera'
    },
    { 
      id: 3, 
      name: 'iPad Pro 12.9"', 
      quantity: 3, 
      duration: 'Feb 3-12, 2026', 
      total: 1815,
      thumbnail: 'tablet'
    }
  ];

  const renderThumbnail = (type: string) => {
    const iconClass = "w-10 h-10 text-gray-400";
    
    switch(type) {
      case 'laptop':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
      case 'camera':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
      case 'tablet':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
      default:
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const deposit = 1000;
  const grandTotal = subtotal + deposit;

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

          {/* Right: Icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            {/* Cart */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </button>
            
            {/* User Profile */}
            <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
              U
            </button>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-white">Order Confirmation</h1>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 pb-12">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
          <div className="grid grid-cols-2 gap-12">
            
            {/* Left Section: Order Summary */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-3">Order Summary</h2>
              
              {/* Product List */}
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-700">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-gray-600 border border-gray-500 rounded flex items-center justify-center flex-shrink-0">
                      {renderThumbnail(item.thumbnail)}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-gray-400">Qty: {item.quantity}</div>
                      <div className="text-sm text-gray-400">{item.duration}</div>
                    </div>
                    
                    {/* Total */}
                    <div className="text-right">
                      <div className="font-semibold text-white">${item.total}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes Section */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes / Special Instructions
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or instructions..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                />
              </div>
            </div>

            {/* Right Section: Rental Details & Status */}
            <div className="space-y-6">
              
              {/* Rental Period Card */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Rental Period</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      defaultValue="2026-02-01T09:00"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      defaultValue="2026-02-15T18:00"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
                <div className="flex items-center justify-center">
                  <span className={`px-4 py-2 rounded-full border font-medium text-sm ${
                    status === 'pending' 
                      ? 'bg-yellow-600 border-yellow-500 text-yellow-100' 
                      : 'bg-green-600 border-green-500 text-green-100'
                  }`}>
                    {status === 'pending' ? 'Pending Confirmation' : 'Confirmed'}
                  </span>
                </div>
                
                {/* Toggle button for demo */}
                <button
                  onClick={() => setStatus(status === 'pending' ? 'confirmed' : 'pending')}
                  className="mt-3 w-full text-xs text-gray-400 hover:text-gray-300 transition-colors"
                >
                  (Click to toggle status)
                </button>
              </div>

              {/* Cost Recap */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rental Total:</span>
                    <span className="text-white font-medium">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Deposit:</span>
                    <span className="text-white font-medium">${deposit}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-white font-bold text-lg">Grand Total:</span>
                      <span className="text-white font-bold text-lg">${grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="mt-8 flex justify-center space-x-6">
            <button
              onClick={() => setStatus('confirmed')}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full border border-white transition-colors"
            >
              Confirm Order
            </button>
            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full border border-white transition-colors">
              Proceed to Payment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;