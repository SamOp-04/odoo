'use client';

import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  rentalPeriod: string;
  image?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PaymentPageProps {
  cartItems: CartItem[];
  navigateTo: (page: any, data?: any) => void;
  createOrder: (orderData: any) => any;
  currentUser: User | null;
  deliveryData?: any;
}

const PaymentPage = ({ cartItems, navigateTo, createOrder, currentUser, deliveryData }: PaymentPageProps) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: 'xxxx xxxx xxxx xxxx',
    saveDetails: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const customerData = {
    name: 'Customer Name',
    address: '123 Customer Address, City, State 12345',
    phone: '+x xxx xxx xxxx'
  };
  
  const orderData = {
    rentalPeriod: '7 days'
  };

  const deliveryCharges = 0;
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + deliveryCharges;

  const handleInputChange = (field: string, value: string | boolean) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderDataToCreate = {
      items: cartItems,
      total,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
      customerId: currentUser?.id || 'guest',
      vendorId: 'vendor1',
      orderNumber: `SO${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      paymentMethod: 'card',
      cardNumber: paymentData.cardNumber.slice(-4),
      customerName: customerData.name,
      deliveryData
    };

    const order = createOrder(orderDataToCreate);
    setIsLoading(false);
    navigateTo('order-confirmation', order);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="w-16 h-8 bg-gray-700 border border-gray-500 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">Your Logo</span>
            </div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Condition</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About us</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="w-80 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <button className="w-8 h-8 border border-gray-500 rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <button className="w-8 h-8 border border-gray-500 rounded flex items-center justify-center hover:bg-gray-700 transition-colors relative">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5L2 18h3.5M7 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b border-gray-700">
        <nav className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">Order</span>
          <span className="text-gray-500">&gt;</span>
          <span className="text-gray-400">Address</span>
          <span className="text-gray-500">&gt;</span>
          <span className="text-white font-medium">Payment</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Payment Method */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>

              {/* Card Section */}
              <div className="bg-gray-750 border border-gray-600 rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 border-2 border-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  </div>
                  <span className="text-white font-medium">Card</span>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">Payment Details</label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="saveDetails"
                    checked={paymentData.saveDetails}
                    onChange={(e) => handleInputChange('saveDetails', e.target.checked)}
                    className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                  />
                  <label htmlFor="saveDetails" className="text-gray-300 text-sm">
                    Save my payment details
                  </label>
                </div>
              </div>
            </div>

            {/* Delivery & Billing */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Delivery & Billing</h2>
                <button className="p-1 text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Customer Name</h3>
                <p className="text-gray-300">{customerData.name}</p>
                <p className="text-gray-400">{customerData.address}</p>
              </div>

              <div className="mt-4">
                <span className="inline-block bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                  Courteous Antelope
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 sticky top-4">

              {/* Product */}
              <div className="mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-700 border-2 border-gray-600 border-dashed rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">IMG</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Product Name</h3>
                    <p className="text-gray-400 text-sm">$xxx/ xxx</p>
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className="mb-6 pb-4 border-b border-gray-700">
                <h4 className="text-white font-medium mb-2">Rental Period</h4>
                <p className="text-gray-400 text-sm">{orderData.rentalPeriod}</p>
              </div>

              {/* Order Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Delivery Charges</span>
                  <span className="text-white">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sub Total</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white font-bold py-4 px-6 rounded-lg border border-white transition-colors disabled:cursor-not-allowed mb-4"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Pay Now'
                )}
              </button>

              {/* OR Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-800 px-3 text-gray-400">OR</span>
                </div>
              </div>

              {/* Back to Address */}
              <button 
                onClick={() => navigateTo('checkout')}
                className="w-full text-gray-400 hover:text-white transition-colors text-center"
              >
                ← Back to Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;