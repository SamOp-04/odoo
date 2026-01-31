'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OrderConfirmationRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);

  // Load user and order from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error loading user:', e);
        }
      }

      // Load last order
      const savedOrder = localStorage.getItem('lastOrder');
      if (savedOrder) {
        try {
          setOrder(JSON.parse(savedOrder));
        } catch (e) {
          console.error('Error loading order:', e);
        }
      }
    }
  }, []);

  // Navigation function
  const navigateTo = (page: string, data?: any) => {
    switch (page) {
      case 'products':
      case 'product-listing':
        router.push('/product-listing-clean');
        break;
      case 'orders':
      case 'my-orders':
        router.push('/orders');
        break;
      default:
        router.push('/product-listing-clean');
    }
  };

  // Logout function
  const onLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
      }
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Delightful Flamingo</h1>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <span className="text-gray-400">Hello, {currentUser.name}</span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-6">
        <div className="text-center mb-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-400 text-lg">Thank you for your order</p>
          
          {order && (
            <div className="mt-4">
              <p className="text-gray-400">Order Number:</p>
              <p className="text-2xl font-bold text-blue-400">
                {order.orderNumber || order.id || `ORD-${Date.now().toString().slice(-6)}`}
              </p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && order.items && order.items.length > 0 && (
          <div className="bg-black border border-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-800 last:border-0">
                  <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">
                      Quantity: {item.quantity || item.cartQuantity}
                    </p>
                    {item.rentalPeriod && (
                      <p className="text-sm text-gray-400">Period: {item.rentalPeriod}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{((item.price || 0) * (item.quantity || item.cartQuantity || 1)).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-blue-400">₹{(order.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-black border border-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 font-bold">1.</span>
              <p>You'll receive an order confirmation email shortly</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 font-bold">2.</span>
              <p>The vendor will prepare your items for pickup/delivery</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 font-bold">3.</span>
              <p>You'll be notified when your order is ready</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigateTo('products')}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigateTo('orders')}
            className="flex-1 px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black font-semibold transition-colors"
          >
            View My Orders
          </button>
        </div>
      </main>
    </div>
  );
}
