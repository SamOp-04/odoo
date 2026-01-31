'use client';

import React, { useState } from 'react';

const AdminOrders = () => {
  const [orders] = useState([
    { id: 'ORD-001', customer: 'John Smith', vendor: 'Tech Solutions', amount: '$450', status: 'Completed', date: '2024-01-28' },
    { id: 'ORD-002', customer: 'Jane Doe', vendor: 'Rentals Co', amount: '$320', status: 'Processing', date: '2024-01-27' },
    { id: 'ORD-003', customer: 'Mike Johnson', vendor: 'Tech Solutions', amount: '$580', status: 'Pending', date: '2024-01-26' },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">All Orders</h1>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Order Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Order ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Customer</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Vendor</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4 text-white font-medium">{order.id}</td>
                  <td className="py-3 px-4 text-gray-300">{order.customer}</td>
                  <td className="py-3 px-4 text-gray-300">{order.vendor}</td>
                  <td className="py-3 px-4 text-white font-semibold">{order.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-600 text-green-100' :
                      order.status === 'Processing' ? 'bg-blue-600 text-blue-100' :
                      'bg-yellow-600 text-yellow-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{order.date}</td>
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

export default AdminOrders;
