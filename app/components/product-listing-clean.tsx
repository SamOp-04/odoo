'use client';

import React, { useState, useEffect } from 'react';

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

interface ProductListingPageProps {
  cartItems: any[];
  addToCart: (product: Product, quantity?: number, rentalPeriod?: string, startDate?: string, endDate?: string) => void;
  navigateTo: (page: 'products' | 'product-detail' | 'cart', data?: any) => void;
  currentUser?: { name: string; id?: string; email?: string } | null;
  onLogout?: () => void;
}

const ProductListingPage: React.FC<ProductListingPageProps> = ({ 
  cartItems, 
  addToCart, 
  navigateTo, 
  currentUser,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      name: "Professional Camera",
      category: "Photography",
      price: 150,
      duration: "per day",
      image: "/api/placeholder/300/200",
      brand: "Canon",
      color: "Black",
      description: "High-end DSLR camera perfect for professional photography with advanced features and excellent image quality. Suitable for both beginners and professionals.",
      available: true,
      pricePerHour: 25,
      pricePerDay: 150,
      pricePerNight: 120,
      pricePerWeek: 900
    },
    {
      id: 2,
      name: "Drone with 4K Camera",
      category: "Technology",
      price: 200,
      duration: "per day",
      image: "/api/placeholder/300/200",
      brand: "DJI",
      color: "White",
      description: "Advanced drone with 4K video recording capabilities and intelligent flight modes. Perfect for aerial photography and videography.",
      available: true,
      pricePerHour: 35,
      pricePerDay: 200,
      pricePerNight: 160,
      pricePerWeek: 1200
    },
    {
      id: 3,
      name: "Wireless Microphone",
      category: "Audio",
      price: 50,
      duration: "per day",
      image: "/api/placeholder/300/200",
      brand: "Shure",
      color: "Black",
      description: "Professional wireless microphone system with crystal clear audio quality. Ideal for interviews, presentations, and recording.",
      available: true,
      pricePerHour: 10,
      pricePerDay: 50,
      pricePerNight: 40,
      pricePerWeek: 300
    },
    {
      id: 4,
      name: "LED Lighting Kit",
      category: "Lighting",
      price: 80,
      duration: "per day",
      image: "/api/placeholder/300/200",
      brand: "Neewer",
      color: "Silver",
      description: "Complete LED lighting setup for video production",
      available: true
    },
    {
      id: 5,
      name: "Gaming Laptop",
      category: "Electronics",
      price: 120,
      duration: "per day",
      image: "/api/placeholder/300/200",
      brand: "ASUS",
      color: "Black",
      description: "High-performance gaming laptop",
      available: true
    },
    {
      id: 6,
      name: "Sound System",
      category: "Audio",
      price: 300,
      duration: "per day",
      image: "/api/placeholder/300/200",
      brand: "JBL",
      color: "Black",
      description: "Professional sound system for events",
      available: true
    },
    {
      id: 7,
      name: "Video Camera",
      category: "Photography",
      price: 180,
      duration: "per day",
      image: "/api/placeholder/300/200",
      brand: "Sony",
      color: "Black",
      description: "Professional video camera for filming",
      available: true
    },
    {
      id: 8,
      name: "Projector",
      category: "Electronics",
      price: 100,
      duration: "per day",
      image: "/api/placeholder/300/200",
      brand: "Epson",
      color: "White",
      description: "High-definition projector for presentations",
      available: true
    },
    {
      id: 9,
      name: "DJ Controller",
      category: "Audio",
      price: 90,
      duration: "per day",
      image: "/api/placeholder/300/200",
      brand: "Pioneer",
      color: "Black",
      description: "Professional DJ mixing controller",
      available: true
    }
  ];

  const brands = Array.from(new Set(products.map(p => p.brand)));
  const colors = Array.from(new Set(products.map(p => p.color)));
  const durations = Array.from(new Set(products.map(p => p.duration)));

  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
      const matchesDuration = selectedDurations.length === 0 || selectedDurations.includes(product.duration);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesBrand && matchesColor && matchesDuration && matchesPrice;
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedBrands, selectedColors, selectedDurations, priceRange]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleDurationChange = (duration: string) => {
    setSelectedDurations(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  const handleProductClick = (product: Product) => {
    navigateTo('product-detail', product);
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
                Your Logo
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">Products</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">Terms & Condition</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">About us</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">Contact Us</a>
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Favorites Icon */}
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Cart Icon with Counter */}
              <button 
                onClick={() => navigateTo('cart')}
                className="relative text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 13M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6M7 13H5" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Profile Menu Button */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-gray-700 rounded"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {currentUser && (
                        <>
                          <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                            {currentUser.name}
                          </div>
                        </>
                      )}
                      <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                        Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                        Settings
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                        My Orders
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                        Wishlist
                      </a>
                      <hr className="border-gray-600 my-1" />
                      <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                        Help & Support
                      </a>
                      <button 
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-red-400"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Filters */}
        <aside className="w-64 bg-gray-900 p-6 border-r border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          
          {/* Brand Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Brand</h4>
            {brands.map(brand => (
              <label key={brand} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="mr-2"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Color</h4>
            {colors.map(color => (
              <label key={color} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorChange(color)}
                  className="mr-2"
                />
                <span>{color}</span>
              </label>
            ))}
          </div>

          {/* Duration Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Duration</h4>
            {durations.map(duration => (
              <label key={duration} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedDurations.includes(duration)}
                  onChange={() => handleDurationChange(duration)}
                  className="mr-2"
                />
                <span>{duration}</span>
              </label>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Price Range</h4>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSelectedBrands([]);
              setSelectedColors([]);
              setSelectedDurations([]);
              setPriceRange([0, 5000]);
              setSearchTerm('');
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Products Grid */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Products ({filteredProducts.length})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:bg-gray-700 transition-colors">
                <div onClick={() => handleProductClick(product)}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-400 font-semibold">${product.price} {product.duration}</span>
                      <span className="text-sm text-gray-500">{product.brand}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Color: {product.color}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found matching your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListingPage;