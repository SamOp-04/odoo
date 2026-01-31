'use client';

import React from 'react';
import Link from 'next/link';
import PageHeader from '@/components/vendor/PageHeader';
import StatCard from '@/components/vendor/StatCard';
import StatusBadge from '@/components/vendor/StatusBadge';
import { mockVendorStats, mockOrders } from '@/lib/mock-data/vendor';

export default function VendorDashboard() {
  const stats = mockVendorStats;
  const activeRentals = mockOrders.filter(order => order.status === 'With Customer');
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Rentals"
          value={stats.totalRentals}
          icon={<BoxIcon />}
          color="purple"
        />
        <StatCard
          title="Total Earnings"
          value={`₹${(stats.totalEarnings / 100000).toFixed(1)}L`}
          icon={<CurrencyIcon />}
          color="green"
          trend={{ value: '+15%', positive: true }}
        />
        <StatCard
          title="Active Rentals"
          value={stats.activeRentals}
          icon={<TrendingIcon />}
          color="blue"
        />
        <StatCard
          title="This Month"
          value={stats.rentalsThisMonth}
          icon={<CalendarIcon />}
          color="orange"
        />
      </div>

      {/* Active Rentals */}
      <div className="bg-black border border-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Active Rentals</h2>
          <Link
            href="/vendor/orders?status=With Customer"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        {activeRentals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Product</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Start Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">End Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeRentals.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                    <td className="py-4 px-4 text-white">{order.products[0]?.productName}</td>
                    <td className="py-4 px-4 text-white">{order.customerName}</td>
                    <td className="py-4 px-4 text-gray-300">{new Date(order.rentalStartDate).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-gray-300">{new Date(order.rentalEndDate).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href={`/vendor/orders/${order.id}`}
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                      >
                        View Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No active rentals at the moment</p>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-black border border-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          <Link
            href="/vendor/orders"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Order ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Products</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Total</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                  <td className="py-4 px-4">
                    <Link
                      href={`/vendor/orders/${order.id}`}
                      className="text-purple-400 hover:text-purple-300 font-medium"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-white">
                    {order.products.map(p => p.productName).join(', ')}
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-white font-medium">₹{order.grandTotal.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Icon Components
function BoxIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
