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

interface CartPageProps {
  cartItems: CartItem[];
  removeFromCart: (id: string) => void;
  navigateTo: (page: any, data?: any) => void;
  createOrder: (orderData: OrderData) => any;
  currentUser: User | null;
  updateCartItem?: (id: string, updates: Partial<CartItem>) => void;
}

const CartPage = ({ cartItems, removeFromCart, navigateTo, createOrder, currentUser, updateCartItem }: CartPageProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExpressCheckout, setShowExpressCheckout] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: '',
    startTime: '00:00:00 am',
    endDate: '',
    endTime: '00:00:00 am'
  });
  
  const [checkoutForm, setCheckoutForm] = useState({
    cardNumber: 'xxxx xxxx xxxx xxxx',
    name: '',
    email: '',
    address: '',
    zipCode: '',
    city: '',
    country: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const deliveryCharges = 0; // Free delivery
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + deliveryCharges;

  const handleQuantityChange = (id: string, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item && updateCartItem) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateCartItem(id, { quantity: newQuantity });
    }
  };

  const handleSaveForLater = (id: string) => {
    // Add save for later functionality
    console.log('Save for later:', id);
  };

  const handleApplyCoupon = () => {
    // Add coupon logic
    console.log('Apply coupon:', couponCode);
  };

  const handleExpressCheckout = () => {
    setShowExpressCheckout(true);
  };

  const handlePayNow = () => {
    // Process payment
    const orderData: OrderData = {
      items: cartItems,
      total,
      status: 'draft',
      createdAt: new Date().toISOString(),
      customerId: currentUser?.id || 'guest',
      vendorId: 'vendor1'
    };
    
    const order = createOrder(orderData);
    navigateTo('order-confirmation', order);
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
              <button className="relative hover:text-blue-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.6 8M7 13l-1.6-8M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
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
            <span className="text-white font-semibold">Add to Cart</span>
            <span className="mx-2">{'>'}</span>
            <span>Address</span>
            <span className="mx-2">{'>'}</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Left Side */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            {cartItems.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
                <button
                  onClick={() => navigateTo('products')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-gray-400 text-sm">Product Image</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                        <p className="text-blue-400 font-semibold text-xl mb-2">Rs {item.price}.00</p>
                        <p className="text-gray-400 text-sm mb-4">
                          Date and time for which the product is rented.
                        </p>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 flex items-center justify-center transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 flex items-center justify-center transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              Remove
                            </button>
                            <span className="text-gray-600">|</span>
                            <button
                              onClick={() => handleSaveForLater(item.id)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              Save for Later
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping Button */}
                <div className="pt-6">
                  <button
                    onClick={() => navigateTo('products')}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors border border-gray-600"
                  >
                    Continue Shopping {'>'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Rental Period */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-semibold mb-4">Rental Period</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value="xx/xx/xxxx  00:00:00 am"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value="xx/xx/xxxx  00:00:00 am"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery Charges</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sub Total</span>
                  <span>Rs{subtotal.toFixed(2)}</span>
                </div>
                <hr className="border-gray-600" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rs{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Apply Coupon */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors whitespace-nowrap"
                >
                  Apply Coupon
                </button>
              </div>

              {/* Pay with Save Card */}
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors border border-gray-600">
                Pay with Save Card
              </button>

              {/* Express Checkout */}
              <button
                onClick={handleExpressCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                Express Checkout
              </button>

              {/* Checkout */}
              <button
                onClick={() => navigateTo('checkout')}
                disabled={cartItems.length === 0}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Express Checkout Modal */}
      {showExpressCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-600">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Express Checkout</h2>
              <button
                onClick={() => setShowExpressCheckout(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Card Details */}
                <div>
                  <label className="block text-sm font-medium mb-2">Card Details</label>
                  <input
                    type="text"
                    value={checkoutForm.cardNumber}
                    onChange={(e) => setCheckoutForm({...checkoutForm, cardNumber: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="xxxx xxxx xxxx xxxx"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Zip Code and City */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code</label>
                    <input
                      type="text"
                      value={checkoutForm.zipCode}
                      onChange={(e) => setCheckoutForm({...checkoutForm, zipCode: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Address (Second) */}
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    value={checkoutForm.country}
                    onChange={(e) => setCheckoutForm({...checkoutForm, country: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Pay Now Button */}
                <div className="pt-4">
                  <button
                    onClick={handlePayNow}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-semibold"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;