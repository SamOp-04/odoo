'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface User {
  name: string;
  company_name?: string;
}

interface OrderLine {
  product_name: string;
  quantity: number;
  subtotal: number;
}

interface Order {
  _id: string;
  order_number: string;
  status: string;
  total_amount: number;
  createdAt: string;
  customer_id?: User;
  vendor_id?: User;
  lines: OrderLine[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">System-wide order management</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or vendor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Statuses</option>
            <option>Confirmed</option>
            <option>With Customer</option>
            <option>Returned</option>
            <option>Cancelled</option>
          </select>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rental Period</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-900">
                    {order.order_number}
                  </td>

                  <td className="py-4 px-6 text-gray-700">
                    {order.vendor_id?.company_name ||
                      order.vendor_id?.name ||
                      '-'}
                  </td>

                  <td className="py-4 px-6 text-gray-700">
                    {order.customer_id?.company_name ||
                      order.customer_id?.name ||
                      '-'}
                  </td>

                  <td className="py-4 px-6 text-gray-700 text-sm">
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>

                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    ₹{order.total_amount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------ */
/* Status Badge */
/* ------------------ */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    confirmed: 'bg-orange-100 text-orange-700 border-orange-200',
    with_customer: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    returned: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
      }`}
    >
      {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
    </span>
  );
}
