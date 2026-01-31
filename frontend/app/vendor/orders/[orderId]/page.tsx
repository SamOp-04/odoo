'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/vendor/PageHeader';
import StatusBadge from '@/components/vendor/StatusBadge';
import { mockOrders } from '@/lib/mock-data/vendor';
import type { OrderStatus } from '@/lib/types/vendor';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState(() => mockOrders.find(o => o.id === orderId));

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg mb-4">Order not found</p>
        <button
          onClick={() => router.push('/vendor/orders')}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    const confirmed = confirm(`Are you sure you want to mark this order as ${newStatus}?`);
    if (confirmed) {
      setOrder({
        ...order,
        status: newStatus,
        statusHistory: [
          ...order.statusHistory,
          { status: newStatus, timestamp: new Date().toISOString() }
        ]
      });
      alert(`Order ${order.id} marked as ${newStatus}`);
    }
  };

  return (
    <div>
      <PageHeader
        title={`Order ${order.id}`}
        breadcrumbs={[
          { label: 'Vendor', href: '/vendor/dashboard' },
          { label: 'Orders', href: '/vendor/orders' },
          { label: order.id },
        ]}
      />

      {/* Order Summary */}
      <div className="bg-black border border-white rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Summary</h2>
            <p className="text-gray-400 text-sm">
              Created on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <StatusBadge status={order.status} />
            {order.status === 'Confirmed' && (
              <button
                onClick={() => handleStatusChange('With Customer')}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors font-medium"
              >
                Mark as Picked Up
              </button>
            )}
            {order.status === 'With Customer' && (
              <button
                onClick={() => handleStatusChange('Returned')}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors font-medium"
              >
                Mark as Returned
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-black border border-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{order.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span className="text-white">{order.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="bg-black border border-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Rental Details</h3>
            <div className="space-y-4">
              {order.products.map((product, index) => (
                <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-700 border border-gray-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs">IMG</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{product.productName}</h4>
                      <p className="text-gray-400 text-sm mb-2">Quantity: {product.quantity}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Start: </span>
                          <span className="text-white">
                            {new Date(order.rentalStartDate).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">End: </span>
                          <span className="text-white">
                            {new Date(order.rentalEndDate).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">₹{product.pricePerUnit.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm">per unit</div>
                      <div className="text-white font-bold mt-2">₹{product.lineTotal.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-black border border-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status History</h3>
            <div className="space-y-4">
              {order.statusHistory.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={item.status} />
                      <span className="text-gray-400 text-sm">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {item.note && <p className="text-gray-400 text-sm mt-1">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-black border border-white rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Rental Total:</span>
                <span className="text-white">₹{order.rentalTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Security Deposit:</span>
                <span className="text-white">₹{order.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax (18%):</span>
                <span className="text-white">₹{order.tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-white font-semibold text-lg">Grand Total:</span>
                  <span className="text-white font-bold text-lg">₹{order.grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Paid:</span>
                  <span className="text-green-400 font-medium">₹{order.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Remaining:</span>
                  <span className="text-white font-medium">
                    ₹{(order.grandTotal - order.amountPaid).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
