'use client';

import React, { useState } from 'react';
import VendorDashboard from './vendor-dashboard';
import VendorProductManagement from './vendor-product-management';
import VendorOrders from './vendor-orders';

const VendorApp = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <VendorDashboard />;
      case 'products':
        return <VendorProductManagement />;
      case 'orders':
        return <VendorOrders />;
      default:
        return <VendorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Demo */}
      <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 rounded-lg p-4">
        <h3 className="text-white text-sm font-medium mb-2">Navigate Vendor Pages:</h3>
        <div className="space-y-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`block w-full text-left px-3 py-1 rounded text-sm ${
              currentPage === 'dashboard'
                ? 'bg-pink-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            } transition-colors`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('products')}
            className={`block w-full text-left px-3 py-1 rounded text-sm ${
              currentPage === 'products'
                ? 'bg-pink-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            } transition-colors`}
          >
            Product Management
          </button>
          <button
            onClick={() => setCurrentPage('orders')}
            className={`block w-full text-left px-3 py-1 rounded text-sm ${
              currentPage === 'orders'
                ? 'bg-pink-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            } transition-colors`}
          >
            Orders (Table/Kanban)
          </button>
        </div>
      </div>

      {/* Current Page Content */}
      {renderCurrentPage()}
    </div>
  );
};

export default VendorApp;