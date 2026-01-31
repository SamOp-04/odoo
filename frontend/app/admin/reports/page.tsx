'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import { mockAdminStats, mockRevenueData } from '@/lib/mock-data/admin';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7days');
  const stats = mockAdminStats;

  const handleExport = () => {
    alert('Exporting report as CSV...');
  };

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive system analytics and insights"
        actions={
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors font-medium"
          >
            Export Report
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-black border border-white rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="text-gray-400 text-sm mb-2 block">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-black border border-white rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
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
          title="Average Order Value"
          value={`₹${Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString()}`}
          icon={<AvgIcon />}
          color="purple"
        />
        <StatCard
          title="Active Vendors"
          value={stats.activeVendors}
          icon={<VendorIcon />}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Revenue Trend</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-700 rounded">
            <div className="text-center">
              <ChartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Line Chart</p>
              <p className="text-gray-500 text-sm">Revenue over selected period</p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Orders by Status</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-700 rounded">
            <div className="text-center">
              <ChartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Pie Chart</p>
              <p className="text-gray-500 text-sm">Order status distribution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Summary Table */}
      <div className="bg-black border border-white rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Revenue by Day (Last 7 Days)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Avg Order Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {mockRevenueData.map((data) => (
                <tr key={data.date}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{data.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">₹{data.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{data.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ₹{Math.round(data.revenue / data.orders).toLocaleString()}
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

function AvgIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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

function ChartIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
