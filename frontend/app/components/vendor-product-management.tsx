'use client';

import React, { useState } from 'react';

const VendorProductManagement = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const products = [
    { 
      id: '1', 
      name: 'MacBook Pro 16"', 
      quantity: 5, 
      price: 150, 
      period: 'day',
      status: 'published',
      thumbnail: 'laptop'
    },
    { 
      id: '2', 
      name: 'Canon EOS R5', 
      quantity: 3, 
      price: 80, 
      period: 'day',
      status: 'published',
      thumbnail: 'camera'
    },
    { 
      id: '3', 
      name: 'iPad Pro 12.9"', 
      quantity: 8, 
      price: 45, 
      period: 'day',
      status: 'unpublished',
      thumbnail: 'tablet'
    },
    { 
      id: '4', 
      name: 'Gaming Console', 
      quantity: 2, 
      price: 25, 
      period: 'day',
      status: 'published',
      thumbnail: 'console'
    },
    { 
      id: '5', 
      name: 'Smart TV 55"', 
      quantity: 4, 
      price: 60, 
      period: 'day',
      status: 'published',
      thumbnail: 'tv'
    },
    { 
      id: '6', 
      name: 'Wireless Speaker', 
      quantity: 10, 
      price: 15, 
      period: 'hour',
      status: 'unpublished',
      thumbnail: 'speakers'
    }
  ];

  const renderThumbnail = (type: string) => {
    const iconClass = "w-8 h-8 text-gray-400";
    
    switch(type) {
      case 'laptop':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
      case 'camera':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
      case 'tablet':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
      case 'console':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
      case 'tv':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
      case 'speakers':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;
      default:
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const toggleProductStatus = (productId: string) => {
    // In real app, this would update the product status
    console.log('Toggle product status:', productId);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Menu */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold">Your Logo</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Orders</a>
              <a href="#" className="text-white font-medium">Products</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Reports</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Settings</a>
            </nav>
          </div>

          {/* Right: Vendor Info */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Vendor Name</span>
            <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-sm font-semibold">
              V
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Vertical Menu */}
        <aside className="w-64 bg-gray-900 border-r border-gray-600 min-h-screen">
          <nav className="p-6 space-y-2">
            <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Dashboard</a>
            <a href="#" className="block px-4 py-2 bg-pink-600 text-white rounded-lg font-medium">Products</a>
            <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Orders</a>
            <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">Invoices</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-8">
              
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4">
                <h1 className="text-2xl font-bold text-white">My Products</h1>
                <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full border border-white transition-colors">
                  Add Product
                </button>
              </div>

              {/* Product Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-4 px-2 text-gray-300 font-medium">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === products.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                        />
                      </th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Product</th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Quantity Available</th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Price</th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-4 px-2">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                            className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-600 border border-gray-500 rounded flex items-center justify-center flex-shrink-0">
                              {renderThumbnail(product.thumbnail)}
                            </div>
                            <span className="text-white font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white">{product.quantity}</td>
                        <td className="py-4 px-4 text-white">${product.price} / {product.period}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full border text-xs font-medium ${
                            product.status === 'published' 
                              ? 'bg-green-600 border-green-500 text-green-100' 
                              : 'bg-gray-600 border-gray-500 text-gray-100'
                          }`}>
                            {product.status === 'published' ? 'Published' : 'Unpublished'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-transparent border border-gray-600 text-gray-300 rounded text-sm hover:bg-gray-700 transition-colors">
                              Edit
                            </button>
                            <button 
                              onClick={() => toggleProductStatus(product.id)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                product.status === 'published'
                                  ? 'bg-gray-600 border border-gray-500 text-gray-100 hover:bg-gray-500'
                                  : 'bg-green-600 border border-green-500 text-green-100 hover:bg-green-500'
                              }`}
                            >
                              {product.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorProductManagement;