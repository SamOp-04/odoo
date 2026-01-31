'use client';

import React, { useState } from 'react';

const AdminVendorProducts = () => {
  const [products] = useState([
    { id: '1', vendor: 'Tech Solutions', name: 'Laptop', status: 'Published', quantity: 5 },
    { id: '2', vendor: 'Rentals Co', name: 'Projector', status: 'Published', quantity: 3 },
    { id: '3', vendor: 'Tech Solutions', name: 'Printer', status: 'Unpublished', quantity: 2 },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Vendor Products</h1>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">All Vendor Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Vendor</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Product</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Quantity</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4 text-white font-medium">{product.vendor}</td>
                  <td className="py-3 px-4 text-gray-300">{product.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Published' 
                        ? 'bg-green-600 text-green-100' 
                        : 'bg-yellow-600 text-yellow-100'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{product.quantity}</td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white text-sm mr-2">
                      View
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white text-sm">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVendorProducts;
