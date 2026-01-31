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

interface CheckoutPageProps {
  cartItems: CartItem[];
  navigateTo: (page: any, data?: any) => void;
  currentUser: User | null;
}

const CheckoutPage = ({ cartItems, navigateTo, currentUser }: CheckoutPageProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('xxxxxxxx, xxxxxxxxxxxxxx, XXXXX');
  const [sameBillingAddress, setSameBillingAddress] = useState(false);

  const deliveryCharges = 0; // Free delivery
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + deliveryCharges;

  const handleConfirm = () => {
    // Navigate to payment page
    const checkoutData = {
      cartItems,
      deliveryMethod,
      customerName,
      deliveryAddress,
      sameBillingAddress,
      total
    };
    
    navigateTo('payment', checkoutData);
  };

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
                  {cartItems.length}
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

      {/* Breadcrumb */}
      <div className="bg-gray-900 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-400">
            <span>Breadcrumb</span>
            <span className="mx-2">{'>'}</span>
            <span>Order</span>
            <span className="mx-2">{'>'}</span>
            <span className="text-white font-semibold">Address</span>
            <span className="mx-2">{'>'}</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Delivery Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Method */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Delivery Method</h2>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600 space-y-4">
                {/* Standard Delivery */}
                <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="radio"
                        id="standard"
                        name="delivery"
                        value="standard"
                        checked={deliveryMethod === 'standard'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        deliveryMethod === 'standard' 
                          ? 'border-blue-400 bg-blue-400' 
                          : 'border-gray-400'
                      }`}>
                        {deliveryMethod === 'standard' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <label htmlFor="standard" className="text-lg cursor-pointer">
                      Standard Delivery
                    </label>
                  </div>
                  <span className="text-lg font-semibold">Free</span>
                </div>

                {/* Pick up from Store */}
                <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="radio"
                        id="pickup"
                        name="delivery"
                        value="pickup"
                        checked={deliveryMethod === 'pickup'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        deliveryMethod === 'pickup' 
                          ? 'border-blue-400 bg-blue-400' 
                          : 'border-gray-400'
                      }`}>
                        {deliveryMethod === 'pickup' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <label htmlFor="pickup" className="text-lg cursor-pointer">
                      Pick up from Store
                    </label>
                  </div>
                  <span className="text-lg font-semibold">Free</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600 space-y-6">
                {/* Customer Name */}
                <div>
                  <label className="block text-lg font-semibold mb-3">Customer Name</label>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-4 py-3 focus:outline-none focus:border-blue-500"
                      placeholder="Enter customer name"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors">
                      Main Address
                    </button>
                  </div>
                </div>

                {/* Address Display */}
                <div className="bg-gray-700 border border-gray-600 rounded p-4 flex justify-between items-center">
                  <span className="text-gray-300">{deliveryAddress}</span>
                  <button className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Billing Address</h2>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <div className="flex items-start space-x-4">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      id="sameBilling"
                      checked={sameBillingAddress}
                      onChange={(e) => setSameBillingAddress(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer ${
                      sameBillingAddress 
                        ? 'border-blue-400 bg-blue-400' 
                        : 'border-gray-400'
                    }`}>
                      {sameBillingAddress && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <label htmlFor="sameBilling" className="text-lg cursor-pointer">
                    If enabled, it will make Billing and Delivery address the sae
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="space-y-6">
            {/* Product Summary */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-4 mb-6">
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
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-blue-400 font-semibold">${item.price}.00/{item.rentalPeriod}</p>
                  </div>
                </div>
              ))}

              {/* Rental Period */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Rental Period</h4>
                <p className="text-gray-400 text-sm">Today and time to end date and time</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery Charges</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sub Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <hr className="border-gray-600" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="mt-6">
                <button
                  onClick={handleConfirm}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors border border-gray-600 mb-4"
                >
                  Confirmed {'>'}
                </button>

                <div className="text-center text-gray-400 mb-4">OR</div>

                {/* Back to Cart */}
                <button
                  onClick={() => navigateTo('cart')}
                  className="w-full bg-transparent text-gray-400 hover:text-white py-3 px-6 rounded-lg transition-colors"
                >
                  {'<'} Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;