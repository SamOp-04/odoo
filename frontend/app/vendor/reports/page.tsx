'use client';

import React from 'react';
import PageHeader from '@/components/vendor/PageHeader';
import StatCard from '@/components/vendor/StatCard';
import { mockVendorStats, mockOrders } from '@/lib/mock-data/vendor';

export default function ReportsPage() {
  const stats = mockVendorStats;
  
  // Calculate some analytics
  const completedOrders = mockOrders.filter(o => o.status === 'Returned').length;
  const activeOrders = mockOrders.filter(o => o.status === 'With Customer').length;
  const confirmedOrders = mockOrders.filter(o => o.status === 'Confirmed').length;

  return (
    <div>
      <PageHeader title="Reports & Analytics" />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.totalEarnings / 100000).toFixed(1)}L`}
          icon={<CurrencyIcon />}
          color="green"
          trend={{ value: '+15%', positive: true }}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalRentals}
          icon={<OrderIcon />}
          color="blue"
          trend={{ value: '+8%', positive: true }}
        />
        <StatCard
          title="Active Customers"
          value={activeOrders}
          icon={<UserIcon />}
          color="purple"
        />
        <StatCard
          title="Completed Orders"
          value={completedOrders}
          icon={<CheckIcon />}
          color="orange"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Revenue Over Last 7 Days</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-700 rounded">
            <div className="text-center">
              <ChartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Chart Component</p>
              <p className="text-gray-500 text-sm">Mock data visualization</p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top 5 Products by Revenue</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-700 rounded">
            <div className="text-center">
              <ChartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Chart Component</p>
              <p className="text-gray-500 text-sm">Mock data visualization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-black border border-white rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Order Status Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div className="text-4xl font-bold text-blue-400 mb-2">{confirmedOrders}</div>
            <div className="text-gray-400">Confirmed</div>
          </div>
          <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div className="text-4xl font-bold text-orange-400 mb-2">{activeOrders}</div>
            <div className="text-gray-400">With Customer</div>
          </div>
          <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div className="text-4xl font-bold text-green-400 mb-2">{completedOrders}</div>
            <div className="text-gray-400">Returned</div>
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-black border border-white rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">This Month Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Rentals This Month</span>
              <span className="text-white font-bold text-2xl">{stats.rentalsThisMonth}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(stats.rentalsThisMonth / stats.totalRentals) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Earnings This Month</span>
              <span className="text-white font-bold text-2xl">
                ₹{(stats.earningsThisMonth / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(stats.earningsThisMonth / stats.totalEarnings) * 100}%` }}
              ></div>
            </div>
          </div>
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

function UserIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
