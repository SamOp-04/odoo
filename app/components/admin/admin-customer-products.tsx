'use client';

import React, { useState } from 'react';

const AdminCustomerProducts = () => {
  const [products] = useState([
    { id: '1', name: 'MacBook Pro 16"', category: 'Electronics', quantity: 5, price: 150 },
    { id: '2', name: 'Camera Kit', category: 'Photography', quantity: 3, price: 800 },
    { id: '3', name: 'Gaming Console', category: 'Electronics', quantity: 2, price: 500 },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Customer Products</h1>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Products Catalog</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Product</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Category</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Quantity</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Price</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4 text-white font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-gray-300">{product.category}</td>
                  <td className="py-3 px-4 text-gray-300">{product.quantity}</td>
                  <td className="py-3 px-4 text-white font-semibold">${product.price}</td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white text-sm mr-2">
                      View
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white text-sm">
                      Edit
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

export default AdminCustomerProducts;
