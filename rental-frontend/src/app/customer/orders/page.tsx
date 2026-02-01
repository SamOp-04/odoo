'use client';

import { useEffect, useState } from 'react';
import { Package, Calendar, CreditCard, XCircle, CheckCircle, Clock, Truck } from 'lucide-react';

interface OrderLine {
  product_name: string;
  quantity: number;
  subtotal: number;
  product_image?: string;
}

interface Order {
  _id: string;
  order_number: string;
  status: string;
  total_amount: number;
  createdAt: string;
  lines: OrderLine[];
  rental_start?: string;
  rental_end?: string;
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ------------------ */
  /* CANCEL ORDER */
  /* ------------------ */
  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      setActionLoading(orderId);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Cancel failed');
      }

      await fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Cancel failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage your rental orders</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {order.order_number}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <StatusBadge status={order.status} />
              </div>

              {/* Rental Duration */}
              {order.rental_start && order.rental_end && (
                <div className="mt-4 flex items-center gap-6 text-sm bg-white/60 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.rental_start).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.rental_end).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.lines.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    {line.product_image ? (
                      <img
                        src={line.product_image}
                        alt={line.product_name}
                        className="h-20 w-20 rounded-lg object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <Package className="h-8 w-8 text-blue-600" />
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-base">
                        {line.product_name}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          Qty: <span className="font-medium">{line.quantity}</span>
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          ₹{line.subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{order.total_amount.toLocaleString('en-IN')}
                  </span>
                </div>

                {order.status === 'confirmed' && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    disabled={actionLoading === order._id}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg border border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="h-4 w-4" />
                    {actionLoading === order._id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start browsing products to place your first order</p>
            <a
              href="/customer/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Products
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------ */
/* Status Badge */
/* ------------------ */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    confirmed: { 
      bg: 'bg-blue-100 border-blue-200', 
      text: 'text-blue-700', 
      icon: CheckCircle, 
      label: 'Confirmed' 
    },
    picked_up: { 
      bg: 'bg-purple-100 border-purple-200', 
      text: 'text-purple-700', 
      icon: Truck, 
      label: 'Picked Up' 
    },
    with_customer: { 
      bg: 'bg-yellow-100 border-yellow-200', 
      text: 'text-yellow-700', 
      icon: Package, 
      label: 'With Customer' 
    },
    returned: { 
      bg: 'bg-green-100 border-green-200', 
      text: 'text-green-700', 
      icon: CheckCircle, 
      label: 'Returned' 
    },
    cancelled: { 
      bg: 'bg-red-100 border-red-200', 
      text: 'text-red-700', 
      icon: XCircle, 
      label: 'Cancelled' 
    },
  };

  const statusConfig = config[status] || { 
    bg: 'bg-gray-100 border-gray-200', 
    text: 'text-gray-700', 
    icon: Clock, 
    label: status.replace('_', ' ') 
  };

  const Icon = statusConfig.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${statusConfig.bg} ${statusConfig.text}`}
    >
      <Icon className="h-4 w-4" />
      {statusConfig.label}
    </span>
  );
}
