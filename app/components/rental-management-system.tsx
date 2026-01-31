'use client';

import React, { useState, useEffect } from 'react';

// Import all components
const ProductListingPage = React.lazy(() => import('./product-listing-clean'));
const ProductDetail = React.lazy(() => import('./product-detail'));
const CartPage = React.lazy(() => import('./cart-page-new'));
const CheckoutPage = React.lazy(() => import('./checkout-page'));
const PaymentPage = React.lazy(() => import('./payment-page-fixed'));
const OrderConfirmationPage = React.lazy(() => import('./order-confirmation-page-new'));

type UserRole = 'customer' | 'vendor' | 'admin' | 'vendor-customer';
type AppPage = 
  | 'login' | 'signup' | 'forgot-password'
  | 'products' | 'product-detail' | 'cart' | 'checkout' | 'order-confirmation' | 'payment'
  | 'vendor-dashboard' | 'vendor-products' | 'vendor-orders'
  | 'settings' | 'reports' | 'profile';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: UserRole[]; // Support for multiple roles
  companyName?: string;
  gstin?: string;
}

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
  items: CartItem[];
  total: number;
  status: 'draft' | 'sent' | 'confirmed' | 'picked-up' | 'returned';
  createdAt: string;
  customerId: string;
  vendorId: string;
  orderNumber?: string;
  paymentMethod?: string;
  customerName?: string;
}

interface RentalManagementSystemProps {
  currentUser?: User | null;
  onLogout?: () => void;
}

const RentalManagementSystem = ({ currentUser: propCurrentUser, onLogout }: RentalManagementSystemProps = {}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(propCurrentUser || null);
  const [currentPage, setCurrentPage] = useState<AppPage>('products');
  const [isLoading, setIsLoading] = useState(true);

  // Application State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotationData, setQuotationData] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Initialize app
  useEffect(() => {
    const checkAuthStatus = () => {
      // If user is provided as prop, skip authentication
      if (propCurrentUser) {
        setCurrentUser(propCurrentUser);
        setIsAuthenticated(true);
        setCurrentPage('products');
      } else {
        // Check localStorage for saved auth
        const savedUser = localStorage.getItem('currentUser');
        const savedAuth = localStorage.getItem('isAuthenticated');
        
        if (savedUser && savedAuth === 'true') {
          setCurrentUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          setCurrentPage('products');
        } else {
          setCurrentPage('login');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Authentication handlers
  const handleLogin = (userData: User) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    
    // Role-based redirect
    if (userData.role === 'admin') {
      setCurrentPage('reports');
    } else if (userData.role === 'vendor' || userData.role === 'vendor-customer') {
      setCurrentPage('vendor-dashboard');
    } else {
      setCurrentPage('products');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCartItems([]);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('cartItems');
    
    // Call parent logout if provided
    if (onLogout) {
      onLogout();
    } else {
      setCurrentPage('login');
    }
  };

  // Navigation handlers
  const navigateTo = (page: AppPage, data?: any) => {
    setCurrentPage(page);
    if (data) {
      if (page === 'order-confirmation') {
        setQuotationData(data);
      } else if (page === 'payment') {
        setSelectedOrder(data);
      } else if (page === 'product-detail') {
        setSelectedProduct(data);
      }
    }
  };

  // Cart management
  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prev, item];
      }
    });
  };

  // Helper function to convert Product to CartItem
  const addProductToCart = (product: any, quantity: number = 1, rentalPeriod: string = 'day', startDate: string = '', endDate: string = '') => {
    const cartItem: CartItem = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity,
      rentalPeriod,
      startDate,
      endDate,
      image: product.image
    };
    addToCart(cartItem);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItem = (itemId: string, updates: Partial<CartItem>) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Order management
  const createOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  // Header component for authenticated pages
  const HeaderWithNav = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => navigateTo(currentUser?.role === 'admin' ? 'reports' : currentUser?.role === 'vendor' ? 'vendor-dashboard' : 'products')}
              className="text-xl font-semibold hover:text-pink-400 transition-colors"
            >
              RentEasy
            </button>
            <nav className="flex space-x-6">
              {currentUser?.role === 'customer' && (
                <>
                  <button
                    onClick={() => navigateTo('products')}
                    className={`hover:text-white transition-colors ${
                      currentPage === 'products' ? 'text-white font-medium' : 'text-gray-300'
                    }`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => navigateTo('cart')}
                    className={`hover:text-white transition-colors relative ${
                      currentPage === 'cart' ? 'text-white font-medium' : 'text-gray-300'
                    }`}
                  >
                    Cart
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                </>
              )}
              {currentUser?.role === 'vendor' && (
                <>
                  <button
                    onClick={() => navigateTo('vendor-dashboard')}
                    className={`hover:text-white transition-colors ${
                      currentPage === 'vendor-dashboard' ? 'text-white font-medium' : 'text-gray-300'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigateTo('vendor-products')}
                    className={`hover:text-white transition-colors ${
                      currentPage === 'vendor-products' ? 'text-white font-medium' : 'text-gray-300'
                    }`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => navigateTo('vendor-orders')}
                    className={`hover:text-white transition-colors ${
                      currentPage === 'vendor-orders' ? 'text-white font-medium' : 'text-gray-300'
                    }`}
                  >
                    Orders
                  </button>
                </>
              )}
              {currentUser?.role === 'admin' && (
                <>
                  <button
                    onClick={() => navigateTo('vendor-dashboard')}
                    className={`hover:text-white transition-colors ${
                      currentPage === 'vendor-dashboard' ? 'text-white font-medium' : 'text-gray-300'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigateTo('vendor-products')}
                    className={`hover:text-white transition-colors ${
                      currentPage === 'vendor-products' ? 'text-white font-medium' : 'text-gray-300'
                    }`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => navigateTo('vendor-orders')}
                    className={`hover:text-white transition-colors ${
                      currentPage === 'vendor-orders' ? 'text-white font-medium' : 'text-gray-300'
                    }`}
                  >
                    Orders
                  </button>
                </>
              )}
              <button
                onClick={() => navigateTo('reports')}
                className={`hover:text-white transition-colors ${
                  currentPage === 'reports' ? 'text-white font-medium' : 'text-gray-300'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => navigateTo('settings')}
                className={`hover:text-white transition-colors ${
                  currentPage === 'settings' ? 'text-white font-medium' : 'text-gray-300'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{currentUser?.name}</span>
            <div className="relative">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );

  // Page components with proper props
  const renderPage = () => {
    // Check if user is not authenticated and no prop user provided
    if (!isAuthenticated && !propCurrentUser) {
      switch (currentPage) {
        case 'login':
          return (
            <div className="min-h-screen bg-black flex items-center justify-center px-8">
              <div className="w-full max-w-md">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
                  <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">LOGO</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white text-center mb-8">Log In to RentEasy</h1>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Login ID</label>
                      <input
                        type="text"
                        placeholder="Enter email"
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Mock login for demo
                      const mockUser: User = {
                        id: '1',
                        name: 'Demo User',
                        email: 'demo@example.com',
                        role: 'customer',
                        companyName: 'Demo Company'
                      };
                      handleLogin(mockUser);
                    }}
                    className="w-full mt-8 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors"
                  >
                    Log In as Customer
                  </button>

                  <button
                    onClick={() => {
                      const mockVendor: User = {
                        id: '2',
                        name: 'Vendor User',
                        email: 'vendor@example.com',
                        role: 'vendor',
                        companyName: 'Vendor Company'
                      };
                      handleLogin(mockVendor);
                    }}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors"
                  >
                    Log In as Vendor
                  </button>

                  <button
                    onClick={() => {
                      const mockAdmin: User = {
                        id: '3',
                        name: 'Admin User',
                        email: 'admin@example.com',
                        role: 'admin',
                        companyName: 'Admin Company'
                      };
                      handleLogin(mockAdmin);
                    }}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors"
                  >
                    Log In as Admin
                  </button>

                  <button
                    onClick={() => {
                      const mockVendorCustomer: User = {
                        id: '4',
                        name: 'Vendor & Customer',
                        email: 'vendorcustomer@example.com',
                        role: 'vendor-customer',
                        roles: ['vendor', 'customer'],
                        companyName: 'Dual Role Company'
                      };
                      handleLogin(mockVendorCustomer);
                    }}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors"
                  >
                    Log In as Vendor & Customer
                  </button>

                  <div className="mt-6 space-y-2 text-center">
                    <button
                      onClick={() => setCurrentPage('forgot-password')}
                      className="block w-full text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                    <p className="text-sm text-gray-400">
                      Do not have an account?{' '}
                      <button
                        onClick={() => setCurrentPage('signup')}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'signup':
          return (
            <div className="min-h-screen bg-black flex items-center justify-center px-8">
              <div className="w-full max-w-md">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
                  <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">LOGO</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white text-center mb-8">Sign Up for RentEasy</h1>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Company Name</label>
                      <input
                        type="text"
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-500 text-white focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentPage('login')}
                    className="w-full mt-8 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors"
                  >
                    Sign Up
                  </button>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setCurrentPage('login')}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Already have an account? Login here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'forgot-password':
          return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
              <h1 className="text-3xl font-bold text-white mb-12 text-center">Reset Password Page</h1>
              <div className="w-full max-w-md">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
                  <div className="w-20 h-20 bg-gray-700 border border-gray-500 rounded-lg mx-auto mb-8 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">LOGO</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white text-center mb-8">Reset Password</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm text-gray-300 mb-3">Enter Email ID:</label>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors text-lg"
                    />
                  </div>

                  <div className="mb-8 p-4 border-2 border-dashed border-orange-500 bg-orange-900/20 rounded-lg">
                    <p className="text-orange-300 text-sm text-center">
                      The system should verify whether the entered email exists.
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentPage('login')}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full border border-white transition-colors"
                  >
                    Submit
                  </button>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setCurrentPage('login')}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    // Authenticated pages
    switch (currentPage) {
      case 'products':
        return <ProductListingPage addToCart={addProductToCart} navigateTo={navigateTo} cartItems={cartItems} currentUser={currentUser} onLogout={handleLogout} />;

      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct}
            addToCart={addToCart} 
            navigateTo={navigateTo} 
            cartItems={cartItems}
            currentUser={currentUser}
          />
        ) : <ProductListingPage addToCart={addProductToCart} navigateTo={navigateTo} cartItems={cartItems} currentUser={currentUser} onLogout={handleLogout} />;

      case 'cart':
        return <CartPage cartItems={cartItems} removeFromCart={removeFromCart} navigateTo={navigateTo} createOrder={createOrder} currentUser={currentUser} updateCartItem={updateCartItem} />;

      case 'checkout':
        return <CheckoutPage cartItems={cartItems} navigateTo={navigateTo} currentUser={currentUser} />;

      case 'payment':
        return <PaymentPage cartItems={cartItems} navigateTo={navigateTo} createOrder={createOrder} currentUser={currentUser} deliveryData={selectedOrder} />;

      case 'order-confirmation':
        return selectedOrder ? (
          <OrderConfirmationPage order={selectedOrder} navigateTo={navigateTo} currentUser={currentUser} />
        ) : <ProductListingPage addToCart={addProductToCart} navigateTo={navigateTo} cartItems={cartItems} currentUser={currentUser} onLogout={handleLogout} />;

      case 'vendor-dashboard':
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
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold text-white border border-white">
                    {currentUser?.name?.charAt(0) || 'V'}
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-8 px-8">
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
                      <div className="grid grid-cols-4 gap-6 py-4 border-b border-white">
                        <div className="text-white font-medium">ORD-001</div>
                        <div className="text-white">Professional Camera</div>
                        <div>
                          <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-600 text-white">
                            Confirmed
                          </span>
                        </div>
                        <div className="text-gray-400">3 days</div>
                      </div>
                      <div className="grid grid-cols-4 gap-6 py-4 border-b border-white">
                        <div className="text-white font-medium">ORD-002</div>
                        <div className="text-white">Lighting Kit</div>
                        <div>
                          <span className="px-3 py-1 text-xs rounded-full font-medium bg-yellow-600 text-white">
                            With Customer
                          </span>
                        </div>
                        <div className="text-gray-400">7 days</div>
                      </div>
                      <div className="grid grid-cols-4 gap-6 py-4">
                        <div className="text-white font-medium">ORD-003</div>
                        <div className="text-white">Drone Equipment</div>
                        <div>
                          <span className="px-3 py-1 text-xs rounded-full font-medium bg-gray-600 text-white">
                            Returned
                          </span>
                        </div>
                        <div className="text-gray-400">2 days</div>
                      </div>
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
            </main>
          </div>
        );

      case 'vendor-products':
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
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigateTo('vendor-products')}
                      className="text-white font-medium border-b-2 border-white pb-1"
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
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold text-white border border-white">
                    {currentUser?.name?.charAt(0) || 'V'}
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-8 px-8">
              {/* Page Title */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white">My Rental Products</h1>
              </div>

              {/* Main Card */}
              <div className="max-w-7xl mx-auto bg-black border border-white rounded-lg p-8">
                {/* Add Product Button */}
                <div className="flex justify-end mb-8">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full transition-colors">
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
            </main>
          </div>
        );

      case 'vendor-orders':
        return (
          <HeaderWithNav>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-white mb-8">Order Management</h1>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0">
                      <div>
                        <h3 className="text-white font-medium">{order.id}</h3>
                        <p className="text-gray-400 text-sm">{order.createdAt.split('T')[0]} • {order.items.length} items</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-green-400 font-medium">₹{order.total}</span>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          order.status === 'confirmed' ? 'bg-green-600 text-white' :
                          order.status === 'draft' ? 'bg-gray-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          {order.status}
                        </span>
                        <button
                          onClick={() => {
                            const newStatus = order.status === 'confirmed' ? 'picked-up' : 'returned';
                            updateOrderStatus(order.id, newStatus);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded border border-white transition-colors"
                        >
                          {order.status === 'confirmed' ? 'Mark Picked Up' : 'Mark Returned'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </HeaderWithNav>
        );

      case 'reports':
        return (
          <HeaderWithNav>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-white mb-8">Reports & Analytics</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-green-400">₹5,67,890</p>
                  <p className="text-gray-400 text-sm">+15% from last month</p>
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Orders</h3>
                  <p className="text-3xl font-bold text-blue-400">156</p>
                  <p className="text-gray-400 text-sm">+8% from last month</p>
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Active Customers</h3>
                  <p className="text-3xl font-bold text-purple-400">89</p>
                  <p className="text-gray-400 text-sm">+12% from last month</p>
                </div>
              </div>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue Chart</h3>
                <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Chart placeholder - Revenue trends over time</p>
                </div>
              </div>
            </div>
          </HeaderWithNav>
        );

      case 'settings':
        return (
          <HeaderWithNav>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={currentUser?.name || ''}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={currentUser?.email || ''}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Company</label>
                      <input
                        type="text"
                        value={currentUser?.companyName || ''}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        readOnly
                      />
                    </div>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full border border-white transition-colors">
                      Update Profile
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">System Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Email Notifications</span>
                      <button className="w-12 h-6 bg-pink-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">SMS Notifications</span>
                      <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Auto-approve Orders</span>
                      <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HeaderWithNav>
        );

      default:
        return (
          <HeaderWithNav>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
            </div>
          </HeaderWithNav>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading RentEasy...</div>
      </div>
    );
  }

  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      {renderPage()}
    </React.Suspense>
  );
};

export default RentalManagementSystem;