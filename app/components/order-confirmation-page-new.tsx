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

interface Order {
  id: string;
  orderNumber?: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
  customerId: string;
  vendorId: string;
  paymentMethod?: string;
  customerName?: string;
}

interface OrderConfirmationPageProps {
  order: Order;
  navigateTo: (page: any, data?: any) => void;
  currentUser?: { name: string } | null;
}

const OrderConfirmationPage = ({ order, navigateTo, currentUser }: OrderConfirmationPageProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-600">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-white text-black px-3 py-1 rounded text-sm font-semibold">
                📱 Your Logo
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigateTo('products')}
                className="hover:text-blue-400 transition-colors"
              >
                Products
              </button>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms & Condition</a>
              <a href="#" className="hover:text-blue-400 transition-colors">About us</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a>
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 pr-10 focus:outline-none focus:border-blue-500"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Favorites */}
              <button className="relative hover:text-red-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Cart */}
              <button 
                onClick={() => navigateTo('cart')}
                className="relative hover:text-blue-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.6 8M7 13l-1.6-8M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-600 z-10">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 hover:bg-gray-700 transition-colors">Profile</a>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-700 transition-colors">Settings</a>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-700 transition-colors">My Orders</a>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-700 transition-colors">Wishlist</a>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-700 transition-colors">Help & Support</a>
                      <hr className="border-gray-600 my-1" />
                      <a href="#" className="block px-4 py-2 hover:bg-gray-700 transition-colors text-red-400">Logout</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Order Confirmation */}
          <div className="lg:col-span-2 space-y-8">
            {/* Thank You Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Thank you for your order</h1>
              <p className="text-xl text-gray-300 mb-6">Order {order?.orderNumber || order?.id || 'Unknown'}</p>
              
              {/* Payment Success Message */}
              <div className="bg-green-600 text-white px-6 py-4 rounded-lg mb-8">
                <p className="text-lg font-semibold">Your Payment has been processed.</p>
              </div>
            </div>

            {/* Delivery & Billing */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Delivery & Billing</h2>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Delivery Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>Standard Delivery - Free</p>
                      <p>Estimated delivery: 2-3 business days</p>
                    </div>
                  </div>

                  {/* Billing Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>Payment Method: Card ending in {order?.paymentMethod === 'card' ? '****' : 'N/A'}</p>
                      <p>Total Paid: ${order?.total?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Customer Name</h2>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600 flex items-center justify-between">
                <div>
                  <p className="text-gray-300 mb-2">{order?.customerName || 'Customer Name'}</p>
                  <div className="inline-flex items-center">
                    <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full mr-2">
                      Worthy Gorilla
                    </span>
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="space-y-6">
            {/* Product Summary */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              {order?.items?.map((item) => (
                <div key={item.id} className="mb-6">
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-700 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-gray-500 text-xs text-center">Product Name</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
                      <p className="text-blue-400 font-semibold">${item.price}.00/{item.rentalPeriod}</p>
                      <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!order?.items || order.items.length === 0) && (
                <div className="text-gray-400 text-center py-4">
                  <p>No items found in this order.</p>
                </div>
              )}

              {/* Rental Period */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Rental Period</h4>
                <p className="text-gray-400 text-sm">Today and time to end date and time</p>
              </div>

              {/* Delivery Charges */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Delivery Charges</h4>
                <p className="text-gray-400 text-sm">Sub Total</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order?.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-6">
                <button
                  onClick={() => navigateTo('products')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors border border-gray-600"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;