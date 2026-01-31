'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderConfirmation() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load order from localStorage
      const savedOrder = localStorage.getItem('lastOrder');
      if (savedOrder) {
        try {
          setOrder(JSON.parse(savedOrder));
        } catch (e) {
          console.error('Error loading order:', e);
        }
      }

      // Load user from localStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error loading user:', e);
        }
      }
    }
  }, []);

  const navigateTo = (page: string) => {
    switch (page) {
      case 'products':
        router.push('/product-listing-clean');
        break;
      case 'orders':
        router.push('/orders');
        break;
      default:
        router.push('/product-listing-clean');
    }
  };

  const onLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
      }
      router.push('/login');
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-300">Loading order details...</div>
        </div>
      </div>
    );
  }

  const orderNumber = order.orderNumber || order.id || `ORD-${Date.now()}`;
  const items = order.items || [];
  const total = order.total || items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Rental Management</h1>
            </div>
            <div className="flex items-center gap-4">
              {currentUser && (
                <>
                  <span className="text-sm text-gray-300">
                    Hello, {currentUser.name}
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-400">Thank you for your order</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
            <div>
              <p className="text-sm text-gray-400 mb-1">Order Number</p>
              <p className="text-xl font-semibold">{orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Order Date</p>
              <p className="text-sm">
                {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
            {items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-800 last:border-0">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-400">
                    Quantity: {item.quantity || item.cartQuantity || 1}
                  </p>
                  {item.rentalPeriod && (
                    <p className="text-sm text-gray-400">
                      Rental: {item.rentalPeriod}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${((item.price || 0) * (item.quantity || item.cartQuantity || 1)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-800">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-green-500">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* What's Next Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-500 text-sm">1</span>
              </div>
              <div>
                <p className="font-medium">Order Confirmation Email</p>
                <p className="text-sm text-gray-400">You'll receive an email with order details shortly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-500 text-sm">2</span>
              </div>
              <div>
                <p className="font-medium">Vendor Preparation</p>
                <p className="text-sm text-gray-400">The vendor will prepare your rental items</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-500 text-sm">3</span>
              </div>
              <div>
                <p className="font-medium">Pickup/Delivery</p>
                <p className="text-sm text-gray-400">You'll be notified when items are ready for pickup or delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigateTo('products')}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigateTo('orders')}
            className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
          >
            View My Orders
          </button>
        </div>
      </main>
    </div>
  );
}
