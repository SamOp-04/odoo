'use client';

import React, { useState, useEffect } from 'react';

// Import all components
const LoginPage = React.lazy(() => import('./login-page'));
const SignupPage = React.lazy(() => import('./signup-page'));
const ForgotPasswordPage = React.lazy(() => import('./forgot-password-page'));
const ProductListingPage = React.lazy(() => import('./product-listing-clean'));
const ProductDetail = React.lazy(() => import('./product-detail'));
const CartPage = React.lazy(() => import('./cart-page-new'));
const CheckoutPage = React.lazy(() => import('./checkout-page'));
const PaymentPage = React.lazy(() => import('./payment-page-fixed'));
const OrderConfirmationPage = React.lazy(() => import('./order-confirmation-page-new'));
const VendorDashboard = React.lazy(() => import('./vendor-dashboard'));
const VendorProductManagement = React.lazy(() => import('./vendor-product-management'));
const VendorOrders = React.lazy(() => import('./vendor-orders'));
const SettingsApp = React.lazy(() => import('./settings-app'));
const ReportsDashboard = React.lazy(() => import('./reports-dashboard'));
const AuthenticatedHeader = React.lazy(() => import('./authenticated-header'));

type UserRole = 'customer' | 'vendor' | 'admin';
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
    } else if (userData.role === 'vendor') {
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
    if (false) {
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
        return <CartPage cartItems={cartItems} removeFromCart={removeFromCart} navigateTo={navigateTo} createOrder={createOrder} currentUser={currentUser} updateCartItem={updateCartItem} />;

      case 'checkout':
        return <CheckoutPage cartItems={cartItems} navigateTo={navigateTo} currentUser={currentUser} />;

      case 'payment':
        return <PaymentPage cartItems={cartItems} navigateTo={navigateTo} createOrder={createOrder} currentUser={currentUser} deliveryData={selectedOrder} />;

      case 'order-confirmation':
        return selectedOrder ? (
          <OrderConfirmationPage order={selectedOrder} navigateTo={navigateTo} currentUser={currentUser} />
        ) : <ProductListingPage addToCart={addProductToCart} navigateTo={navigateTo} cartItems={cartItems} currentUser={currentUser} onLogout={handleLogout} />;
        return (
          <HeaderWithNav>
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Payment</h1>
                {selectedOrder && (
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Payment Details</h2>
                    <div className="mb-6">
                      <p className="text-gray-400 mb-2">Order Total: <span className="text-pink-400 font-bold">₹{selectedOrder.total}</span></p>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Payment Method</label>
                        <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500">
                          <option>Credit Card</option>
                          <option>Debit Card</option>
                          <option>UPI</option>
                          <option>Net Banking</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'confirmed');
                        clearCart();
                        alert('Payment successful! Order confirmed.');
                        navigateTo('products');
                      }}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-full border border-white transition-colors"
                    >
                      Pay ₹{selectedOrder.total}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </HeaderWithNav>
        );

      case 'vendor-dashboard':
        return (
          <HeaderWithNav>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-white mb-8">Vendor Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-green-400">₹1,25,000</p>
                  <p className="text-gray-400 text-sm">This month</p>
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Active Rentals</h3>
                  <p className="text-3xl font-bold text-blue-400">24</p>
                  <p className="text-gray-400 text-sm">Currently rented</p>
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Pending Returns</h3>
                  <p className="text-3xl font-bold text-orange-400">8</p>
                  <p className="text-gray-400 text-sm">Due for return</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                        <div>
                          <p className="text-white font-medium">{order.id}</p>
                          <p className="text-gray-400 text-sm">{order.createdAt.split('T')[0]}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-medium">₹{order.total}</p>
                          <p className="text-gray-400 text-sm capitalize">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {['Professional Camera 1', 'Professional Camera 2', 'Professional Camera 3'].map((product, index) => (
                      <div key={product} className="flex justify-between items-center py-2 border-b border-gray-700">
                        <div>
                          <p className="text-white font-medium">{product}</p>
                          <p className="text-gray-400 text-sm">{15 - index * 3} rentals</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-medium">₹{(25000 - index * 5000).toLocaleString()}</p>
                          <p className="text-gray-400 text-sm">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </HeaderWithNav>
        );

      case 'vendor-products':
        return (
          <HeaderWithNav>
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Product Management</h1>
                <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full border border-white transition-colors">
                  Add New Product
                </button>
              </div>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(id => (
                    <div key={id} className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">IMG</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Professional Camera {id}</h3>
                          <p className="text-gray-400 text-sm">₹500/day • Available: 5 units</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded border border-white transition-colors">
                          Edit
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded border border-white transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </HeaderWithNav>
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