'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/vendor/PageHeader';
import StatusBadge from '@/components/vendor/StatusBadge';
import { mockOrders } from '@/lib/mock-data/vendor';
import type { Order, OrderStatus } from '@/lib/types/vendor';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate = (!dateFrom || new Date(order.createdAt) >= new Date(dateFrom)) &&
      (!dateTo || new Date(order.createdAt) <= new Date(dateTo));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const confirmed = confirm(`Are you sure you want to mark this order as ${newStatus}?`);
    if (confirmed) {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                statusHistory: [
                  ...order.statusHistory,
                  { status: newStatus, timestamp: new Date().toISOString() }
                ]
              }
            : order
        )
      );
      alert(`Order ${orderId} marked as ${newStatus}`);
    }
  };

  return (
    <div>
      <PageHeader title="Orders" />

      {/* Filters */}
      <div className="bg-black border border-white rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by Order ID or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-white rounded py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
              className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="With Customer">With Customer</option>
              <option value="Returned">Returned</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Date To */}
          <div>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-black border border-white rounded py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {(searchTerm || statusFilter || dateFrom || dateTo) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setDateFrom('');
              setDateTo('');
            }}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-black border border-white rounded-lg overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Order ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Customer</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Products</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Rental Period</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Total</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                    <td className="py-4 px-4">
                      <Link
                        href={`/vendor/orders/${order.id}`}
                        className="text-purple-400 hover:text-purple-300 font-medium"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{order.customerName}</div>
                      <div className="text-gray-400 text-sm">{order.customerEmail}</div>
                    </td>
                    <td className="py-4 px-4 text-white">
                      {order.products.map(p => p.productName).join(', ')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white text-sm">
                        {new Date(order.rentalStartDate).toLocaleDateString()}
                      </div>
                      <div className="text-gray-400 text-xs">
                        to {new Date(order.rentalEndDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white font-medium">₹{order.grandTotal.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/vendor/orders/${order.id}`}
                          className="px-3 py-1.5 text-xs rounded-full font-medium bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors"
                        >
                          View
                        </Link>
                        {order.status === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'With Customer')}
                            className="px-3 py-1.5 text-xs rounded-full font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                          >
                            Mark Picked Up
                          </button>
                        )}
                        {order.status === 'With Customer' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'Returned')}
                            className="px-3 py-1.5 text-xs rounded-full font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                          >
                            Mark Returned
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ClipboardIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No orders found</p>
            <p className="text-gray-500 text-sm">
              {searchTerm || statusFilter || dateFrom || dateTo
                ? 'Try adjusting your filters'
                : 'Orders will appear here once customers place them'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ClipboardIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}
