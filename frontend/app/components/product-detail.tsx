'use client';

import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: string;
  image: string;
  brand: string;
  color: string;
  description: string;
  available: boolean;
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerNight?: number;
  pricePerWeek?: number;
}

interface ProductDetailProps {
  product: Product;
  cartItems: any[];
  addToCart: (item: any) => void;
  navigateTo: (page: 'products' | 'cart' | 'product-detail', data?: any) => void;
  currentUser?: { name: string } | null;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  cartItems, 
  addToCart, 
  navigateTo, 
  currentUser 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'hour' | 'day' | 'night' | 'week'>('day');

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id.toString(),
      name: product.name,
      price: product.pricePerDay || product.price,
      quantity,
      rentalPeriod: selectedPeriod,
      startDate,
      endDate,
      image: product.image
    };
    addToCart(cartItem);
  };

  const getPriceDisplay = () => {
    const basePrice = product.pricePerDay || product.price;
    const prices = {
      hour: product.pricePerHour || Math.round(basePrice / 24),
      day: product.pricePerDay || product.price,
      night: product.pricePerNight || Math.round(basePrice * 0.8),
      week: product.pricePerWeek || Math.round(basePrice * 6)
    };
    
    return `R${prices[selectedPeriod]}/per ${selectedPeriod}`;
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
      <div className="bg-gray-900 px-4 py-2">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-400">
            <button 
              onClick={() => navigateTo('products')}
              className="hover:text-white transition-colors"
            >
              All Products
            </button>
            <span className="mx-2">/</span>
            <span className="text-white">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-800 rounded-lg p-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            
            {/* Price Display */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">{getPriceDisplay()}</div>
              <div className="text-gray-400 text-sm">
                (Price for the product/per hour/per day/per night/per week)
              </div>
            </div>

            {/* Pricing Period Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Pricing Period</h3>
              <div className="grid grid-cols-2 gap-2">
                {(['hour', 'day', 'night', 'week'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded capitalize transition-colors ${
                      selectedPeriod === period
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Per {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Rental Period */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Rental Period (UTC + 01:00)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">From</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">To</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                🛒 Add to cart
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors">
                ⚙️
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors">
                📋
              </button>
            </div>

            {/* Product Info */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Brand:</span>
                  <span>{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Color:</span>
                  <span>{product.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Availability:</span>
                  <span className={product.available ? 'text-green-400' : 'text-red-400'}>
                    {product.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;