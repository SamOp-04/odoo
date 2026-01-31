'use client';

import React, { useState } from 'react';
import CartQuotationPage from './cart-quotation-page';
import VariantsDialog from './variants-dialog';

const RentalManagementApp = () => {
  const [currentPage, setCurrentPage] = useState<'products' | 'cart'>('products');
  const [isVariantsDialogOpen, setIsVariantsDialogOpen] = useState(false);

  const openVariantsDialog = () => {
    setIsVariantsDialogOpen(true);
  };

  const closeVariantsDialog = () => {
    setIsVariantsDialogOpen(false);
  };

  const navigateToCart = () => {
    setCurrentPage('cart');
  };

  if (currentPage === 'cart') {
    return <CartQuotationPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Condition</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About us</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
            </nav>
          </div>

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

          <div className="flex items-center space-x-6">
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5m0-10V7a4 4 0 00-8 0v5.586l-1.293 1.293A1 1 0 003 15h3m5 2v1a2 2 0 11-4 0v-1m4 0H9" />
              </svg>
            </button>
            
            <button 
              onClick={navigateToCart}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </button>
            
            <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
              U
            </button>
          </div>
        </div>
      </header>

      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-white">Product Page</h1>
      </div>

      <main className="max-w-6xl mx-auto px-8 pb-12">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-700 border border-gray-600 rounded-lg aspect-square flex items-center justify-center">
              <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">MacBook Pro 16"</h2>
                <p className="text-gray-300">Professional laptop for creative work and development.</p>
              </div>

              <div className="space-y-2">
                <div className="text-white">
                  <span className="text-2xl font-bold">$150</span>
                  <span className="text-gray-400">/day</span>
                </div>
                <div className="text-gray-300">
                  Deposit: <span className="text-white font-semibold">$500</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Rental Period</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="datetime-local"
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="datetime-local"
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={openVariantsDialog}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full border border-white transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button className="px-6 py-3 bg-transparent border border-gray-600 text-gray-300 rounded-full hover:bg-gray-700 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VariantsDialog
        isOpen={isVariantsDialogOpen}
        onClose={closeVariantsDialog}
        productName='MacBook Pro 16"'
      />
    </div>
  );
};

export default RentalManagementApp;