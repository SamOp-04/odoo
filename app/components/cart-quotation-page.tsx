'use client';

import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  rentalPeriod: string;
  startDate: string;
  endDate: string;
  image?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface OrderData {
  items: CartItem[];
  total: number;
  status: 'draft';
  createdAt: string;
  customerId: string;
  vendorId: string;
}

interface CartQuotationPageProps {
  cartItems: CartItem[];
  removeFromCart: (id: string) => void;
  navigateTo: (page: any, data?: any) => void;
  createOrder: (orderData: OrderData) => any;
  currentUser: User | null;
}

const CartQuotationPage = ({ cartItems, removeFromCart, navigateTo, createOrder, currentUser }: CartQuotationPageProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: '',
    startTime: '00:00:00 am',
    endDate: '',
    endTime: '00:00:00 am'
  });

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  // Show empty cart message if no items
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-6">Add some products to get started!</p>
          <button 
            onClick={() => navigateTo('products')}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg border border-white transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

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
              <button onClick={() => navigateTo('products')} className="text-gray-300 hover:text-white transition-colors">Products</button>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Condition</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About us</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
            </nav>
          </div>
          
          <div className="text-xl font-bold text-white">
            RentEasy
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigateTo('products')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Products
            </button>
            
            {/* User Menu */}
            <div className="relative user-menu">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 border border-gray-500 rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                      My Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                      My Orders
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                      Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                      Help & Support
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-white mb-6">Order Summary</h1>
            
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-700 border-2 border-gray-600 border-dashed rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs">IMG</span>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg">{item.name}</h3>
                      <p className="text-pink-400 text-lg font-semibold">Rs {item.price}</p>
                      <p className="text-gray-400 text-sm mt-2">{item.startDate} to {item.endDate} ({item.rentalPeriod})</p>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-4 mt-4">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 text-sm transition-colors"
                        >
                          Remove
                        </button>
                        <span className="text-gray-500">|</span>
                        <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                          Save for Later
                        </button>
                      </div>
                    </div>
                    
                    {/* Quantity Display */}
                    <div className="flex items-center">
                      <span className="text-white font-medium">Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Rental Period</h2>
              
              {/* Date and Time Inputs */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Start Date</label>
                    <input 
                      type="date"
                      value={rentalPeriod.startDate}
                      onChange={(e) => setRentalPeriod({...rentalPeriod, startDate: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Start Time</label>
                    <select 
                      value={rentalPeriod.startTime}
                      onChange={(e) => setRentalPeriod({...rentalPeriod, startTime: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="00:00:00 am">12:00 AM</option>
                      <option value="09:00:00 am">9:00 AM</option>
                      <option value="12:00:00 pm">12:00 PM</option>
                      <option value="06:00:00 pm">6:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">End Date</label>
                    <input 
                      type="date"
                      value={rentalPeriod.endDate}
                      onChange={(e) => setRentalPeriod({...rentalPeriod, endDate: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">End Time</label>
                    <select 
                      value={rentalPeriod.endTime}
                      onChange={(e) => setRentalPeriod({...rentalPeriod, endTime: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="00:00:00 am">12:00 AM</option>
                      <option value="09:00:00 am">9:00 AM</option>
                      <option value="12:00:00 pm">12:00 PM</option>
                      <option value="06:00:00 pm">6:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Cost Summary */}
              <div className="space-y-3 mb-6 pb-4 border-b border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-300">Delivery Charges</span>
                  <span className="text-white">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sub Total</span>
                  <span className="text-white">Rs {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-white">Rs {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    if (cartItems.length > 0) {
                      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                      const orderData = {
                        items: cartItems,
                        total,
                        status: 'draft' as const,
                        createdAt: new Date().toISOString(),
                        customerId: currentUser?.id || '',
                        vendorId: 'vendor-1'
                      };
                      const newOrder = createOrder(orderData);
                      navigateTo('payment', newOrder);
                    }
                  }}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg border border-white transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartQuotationPage;