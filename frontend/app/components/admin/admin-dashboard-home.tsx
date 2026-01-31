'use client';

import React from 'react';

const AdminDashboardHome = () => {
  const stats = [
    { label: 'Total Orders', value: '1,234', icon: '📦', color: 'bg-blue-600' },
    { label: 'Total Users', value: '456', icon: '👥', color: 'bg-purple-600' },
    { label: 'Vendors', value: '78', icon: '🏪', color: 'bg-orange-600' },
    { label: 'Total Revenue', value: '$45,678', icon: '💰', color: 'bg-green-600' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Smith', amount: '$450', status: 'Completed', date: '2024-01-28' },
    { id: 'ORD-002', customer: 'Jane Doe', amount: '$320', status: 'Processing', date: '2024-01-27' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: '$580', status: 'Pending', date: '2024-01-26' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-lg text-2xl`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Order ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Customer</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4 text-white font-medium">{order.id}</td>
                  <td className="py-3 px-4 text-gray-300">{order.customer}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white text-sm font-medium">
              Add New User
            </button>
            <button className="w-full px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white text-sm font-medium">
              View Reports
            </button>
            <button className="w-full px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white text-sm font-medium">
              Manage Orders
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Status</span>
              <span className="text-green-500 font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database</span>
              <span className="text-green-500 font-semibold">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Uptime</span>
              <span className="text-green-500 font-semibold">99.9%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Platform Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Users</span>
              <span className="text-blue-400 font-semibold">234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Today's Orders</span>
              <span className="text-blue-400 font-semibold">45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Revenue (Today)</span>
              <span className="text-blue-400 font-semibold">$3,450</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
