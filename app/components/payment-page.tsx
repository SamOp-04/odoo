'use client';

import React, { useState } from 'react';

const PaymentPage = () => {
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [cardNumber, setCardNumber] = useState('');
  const [savePaymentDetails, setSavePaymentDetails] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'none' | 'success' | 'failed'>('none');

  const orderData = {
    product: {
      name: 'MacBook Pro 16"',
      thumbnail: 'laptop',
      rentalPeriod: 'Feb 1, 2026 9:00 AM – Feb 15, 2026 6:00 PM'
    },
    deliveryCharges: 25,
    subTotal: 7295,
    deposit: 1000,
    fullTotal: 8320 // subTotal + deposit + delivery
  };

  const currentTotal = paymentType === 'full' ? orderData.fullTotal : (orderData.deposit + orderData.deliveryCharges);

  const renderThumbnail = () => {
    return (
      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    );
  };

  const handlePayment = () => {
    // Simulate payment processing
    const isSuccess = Math.random() > 0.3; // 70% success rate for demo
    setPaymentStatus(isSuccess ? 'success' : 'failed');
    
    if (isSuccess) {
      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        // This would be handled by router in a real app
        console.log('Redirecting to order confirmation...');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Condition</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About us</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, categories, or rentals..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            {/* Cart */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </button>
            
            {/* User Profile */}
            <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
              U
            </button>
          </div>
        </div>
      </header>

      {/* Status Banners */}
      {paymentStatus === 'success' && (
        <div className="bg-green-600 border-b border-green-500 px-8 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-white text-center font-medium">
              Your payment has been processed. Redirecting to order confirmation...
            </p>
          </div>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="bg-red-600 border-b border-red-500 px-8 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-white text-center font-medium">
              Payment failed. Please try again or use a different method.
            </p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm">
            <span className="text-gray-400">Browse products</span>
            <span className="mx-2 text-gray-500">&gt;</span>
            <span className="text-gray-400">Order</span>
            <span className="mx-2 text-gray-500">&gt;</span>
            <span className="text-gray-400">Address</span>
            <span className="mx-2 text-gray-500">&gt;</span>
            <span className="text-white font-medium">Payment</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-2 gap-12">
          
          {/* Left Column - Payment Options */}
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-white">Payment</h1>

            {/* Payment Amount Section */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Payment Amount</h2>
              
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    value="full"
                    checked={paymentType === 'full'}
                    onChange={(e) => setPaymentType(e.target.value as 'full')}
                    className="mt-1 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="text-white font-medium">Full payment</div>
                    {paymentType === 'full' && (
                      <div className="text-sm text-gray-400 mt-1">
                        You will pay rental + deposit now.
                      </div>
                    )}
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    value="partial"
                    checked={paymentType === 'partial'}
                    onChange={(e) => setPaymentType(e.target.value as 'partial')}
                    className="mt-1 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="text-white font-medium">Partial payment (deposit only)</div>
                    {paymentType === 'partial' && (
                      <div className="text-sm text-gray-400 mt-1">
                        You will pay only the security deposit now. Remaining rental will be collected later.
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="savePayment"
                    checked={savePaymentDetails}
                    onChange={(e) => setSavePaymentDetails(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="savePayment" className="text-sm text-gray-300 cursor-pointer">
                    Save my payment details
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Invoice Preview */}
          <div>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-600 pb-3">
                Invoice Preview
              </h2>

              {/* Product Info */}
              <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-700">
                <div className="w-12 h-12 bg-gray-600 border border-gray-500 rounded flex items-center justify-center flex-shrink-0">
                  {renderThumbnail()}
                </div>
                <div>
                  <div className="font-medium text-white">{orderData.product.name}</div>
                  <div className="text-sm text-gray-400">Rental Period</div>
                  <div className="text-sm text-gray-300">{orderData.product.rentalPeriod}</div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Delivery charges:</span>
                  <span className="text-white">${orderData.deliveryCharges}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sub-Total:</span>
                  <span className="text-white">${orderData.subTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Deposit:</span>
                  <span className="text-white">${orderData.deposit}</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-bold text-lg">Total to Pay Now:</span>
                    <span className="text-white font-bold text-lg">${currentTotal}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={!cardNumber.trim() || paymentStatus === 'success'}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-full border border-white transition-colors"
                >
                  {paymentStatus === 'success' ? 'Processing...' : 'Pay Now'}
                </button>

                <div className="text-center">
                  <span className="text-gray-400 text-sm">OR</span>
                </div>

                <button className="w-full text-gray-300 hover:text-white text-sm underline transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;