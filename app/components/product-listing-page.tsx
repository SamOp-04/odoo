'use client';

import React, { useState } from 'react';

const ProductListingPage = () => {
  const [selectedBrand, setSelectedBrand] = useState('Brand');
  const [selectedColor, setSelectedColor] = useState('Color');
  const [selectedDuration, setSelectedDuration] = useState('Duration');
  const [selectedAllDuration, setSelectedAllDuration] = useState('All Duration');
  const [priceRange, setPriceRange] = useState(5000);

  const products = [
    { name: 'Comfort Sofa', price: '150', unit: 'per month', image: 'sofa', available: true, tooltip: 'Euphoric Yak' },
    { name: 'Wooden Cabinet', price: '80', unit: 'per month', image: 'cabinet', available: true },
    { name: 'Smart TV 55"', price: '200', unit: 'per month', image: 'tv', available: false },
    { name: 'Desktop PC', price: '120', unit: 'per day', image: 'desktop', available: true },
    { name: 'Gaming Laptop', price: '150', unit: 'per day', image: 'laptop', available: true },
    { name: 'Gaming Console', price: '50', unit: 'per day', image: 'console', available: true, tooltip: 'Vibrant Whale' },
    { name: 'King Size Bed', price: '100', unit: 'per month', image: 'bed', available: true },
    { name: 'Speaker System', price: '30', unit: 'per hour', image: 'speakers', available: true }
  ];

  const renderProductIcon = (type: string) => {
    const iconClass = "w-16 h-16 text-gray-400";
    
    switch(type) {
      case 'sofa':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>;
      case 'cabinet':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
      case 'tv':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
      case 'desktop':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
      case 'laptop':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
      case 'console':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
      case 'bed':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>;
      case 'speakers':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;
      default:
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Header */}
      <div className="px-8 py-4">
        {/* Customer Login */}
        <div className="text-left mb-2">
          <span className="text-sm text-gray-300">Customer Login</span>
        </div>

        {/* Home Page Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Home Page up on Sign In</h1>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          {/* Left: Logo and Menu */}
          <div className="flex items-center space-x-8">
            <div className="text-lg font-semibold text-white">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Terms & Condition</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">About us</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Contact Us</a>
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 pr-10 text-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Icons and Labels */}
          <div className="flex items-center space-x-6">
            {/* Notification */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5m0-10V7a4 4 0 00-8 0v5.586l-1.293 1.293A1 1 0 003 15h3m5 2v1a2 2 0 11-4 0v-1m4 0H9" />
              </svg>
            </button>
            
            {/* Cart with Counter */}
            <div className="relative">
              <button className="p-2 text-gray-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 text-xs text-gray-400 mt-1">Wishlist</span>
            </div>
            
            {/* User Avatar */}
            <div className="relative">
              <button className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center text-xs font-semibold">
                U
              </button>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 text-xs text-gray-400 mt-1 whitespace-nowrap">User Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex px-8 gap-6">
        {/* Left Filter Panel */}
        <div className="w-64 space-y-4">
          {/* Brand Dropdown */}
          <div>
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              <option value="Brand">Brand</option>
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="IKEA">IKEA</option>
              <option value="Sony">Sony</option>
            </select>
          </div>

          {/* Color Dropdown */}
          <div>
            <select 
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              <option value="Color">Color</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Brown">Brown</option>
              <option value="Gray">Gray</option>
            </select>
          </div>

          {/* Duration Dropdown */}
          <div>
            <select 
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              <option value="Duration">Duration</option>
              <option value="Short term">Short term</option>
              <option value="Long term">Long term</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="mt-6">
            <label className="block text-white text-sm mb-3">Price Range</label>
            <div className="px-2">
              <input
                type="range"
                min="10"
                max="10000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>$10</span>
                <span>$10000</span>
              </div>
              <div className="text-center text-sm text-white mt-2">${priceRange}</div>
            </div>
          </div>

          {/* All Duration Dropdown */}
          <div className="mt-8">
            <select 
              value={selectedAllDuration}
              onChange={(e) => setSelectedAllDuration(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              <option value="All Duration">All Duration</option>
              <option value="1 Month">1 Month</option>
              <option value="6 Month">6 Month</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
            </select>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="flex-1">
          {/* Product Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {products.map((product, index) => (
              <div key={index} className="relative">
                {/* Tooltip for specific products */}
                {product.tooltip && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-600 z-10">
                    {product.tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-800"></div>
                  </div>
                )}

                {/* Product Card */}
                <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors">
                  {/* Product Image Area */}
                  <div className="relative bg-gray-800 border border-gray-700 rounded aspect-square flex items-center justify-center mb-3">
                    {renderProductIcon(product.image)}
                    
                    {/* Availability Badge */}
                    {!product.available && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full border border-red-500">
                          Out of stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="text-center">
                    <h3 className="text-white text-sm font-medium mb-1">{product.name}</h3>
                    <p className="text-gray-400 text-xs">
                      Rs{product.price} / {product.unit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center space-x-2">
            <button className="w-8 h-8 bg-gray-900 border border-gray-600 rounded-full flex items-center justify-center text-white hover:border-gray-500 transition-colors">
              ◀
            </button>
            <button className="w-8 h-8 bg-gray-600 border border-gray-500 rounded-full flex items-center justify-center text-white">
              1
            </button>
            <button className="w-8 h-8 bg-gray-900 border border-gray-600 rounded-full flex items-center justify-center text-white hover:border-gray-500 transition-colors">
              2
            </button>
            <button className="w-8 h-8 bg-gray-900 border border-gray-600 rounded-full flex items-center justify-center text-white hover:border-gray-500 transition-colors">
              ▶
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default ProductListingPage;