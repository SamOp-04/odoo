'use client';

import React from 'react';
import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  mockAdminStats,
  mockRevenueData,
  mockTopProducts,
  mockTopVendors,
  mockAdminNotifications,
} from '@/lib/mock-data/admin';

export default function AdminDashboard() {
  const stats = mockAdminStats;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="System-wide overview and performance metrics"
      />

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
          icon={<CurrencyIcon />}
          color="green"
          trend={{ value: `+${stats.revenueChange}%`, positive: true }}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<OrderIcon />}
          color="blue"
          trend={{ value: `+${stats.ordersChange}%`, positive: true }}
        />
        <StatCard
          title="Active Vendors"
          value={stats.activeVendors}
          icon={<VendorIcon />}
          color="purple"
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          icon={<ProductIcon />}
          color="orange"
        />
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Revenue (Last 7 Days)</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-700 rounded">
            <div className="text-center">
              <ChartPlaceholderIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Revenue Chart</p>
              <p className="text-gray-500 text-sm">Chart.js / Recharts integration</p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Orders Over Time</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-700 rounded">
            <div className="text-center">
              <ChartPlaceholderIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Orders Chart</p>
              <p className="text-gray-500 text-sm">Chart.js / Recharts integration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products & Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-black border border-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Top Products</h2>
            <Link
              href="/admin/products"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {mockTopProducts.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"
              >
                <div>
                  <div className="text-white font-medium">{product.productName}</div>
                  <div className="text-gray-400 text-sm">{product.vendorName}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">₹{(product.totalRevenue / 1000).toFixed(0)}K</div>
                  <div className="text-gray-400 text-sm">{product.totalRentals} rentals</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-black border border-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Top Vendors</h2>
            <Link
              href="/admin/vendors"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {mockTopVendors.map((vendor) => (
              <div
                key={vendor.vendorId}
                className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"
              >
                <div>
                  <div className="text-white font-medium">{vendor.vendorName}</div>
                  <div className="text-gray-400 text-sm">{vendor.totalOrders} orders</div>
                </div>
                <div className="text-right flex items-center space-x-4">
                  <div>
                    <div className="text-white font-bold">₹{(vendor.totalRevenue / 100000).toFixed(1)}L</div>
                  </div>
                  <StatusBadge status={vendor.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black border border-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity & Alerts</h2>
        </div>
        <div className="space-y-4">
          {mockAdminNotifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-blue-900/20 border-blue-700'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {notification.type === 'info' && <InfoIcon className="w-5 h-5 text-blue-400" />}
                  {notification.type === 'warning' && <WarningIcon className="w-5 h-5 text-orange-400" />}
                  {notification.type === 'error' && <ErrorIcon className="w-5 h-5 text-red-400" />}
                  {notification.type === 'success' && <SuccessIcon className="w-5 h-5 text-green-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">{notification.title}</h3>
                    <span className="text-gray-400 text-sm">{notification.timestamp}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{notification.description}</p>
                  {notification.relatedEntity && (
                    <Link
                      href={`/admin/${notification.relatedEntity.type}s/${notification.relatedEntity.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                    >
                      View {notification.relatedEntity.type} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Icon Components
function CurrencyIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function VendorIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function ChartPlaceholderIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  );
}

function InfoIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WarningIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function ErrorIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SuccessIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
