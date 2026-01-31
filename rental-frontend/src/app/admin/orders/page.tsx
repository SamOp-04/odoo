'use client';

import { useEffect, useState } from 'react';

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
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
    return <p className="text-sm text-gray-500">Loading orders…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Orders</h1>

      <div className="rounded bg-white p-4 shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-2 font-medium">
                  {order.order_number}
                </td>

                <td>
                  {order.customer_id?.company_name ||
                    order.customer_id?.name ||
                    '-'}
                </td>

                <td>
                  {order.vendor_id?.company_name ||
                    order.vendor_id?.name ||
                    '-'}
                </td>

                <td>
                  <StatusBadge status={order.status} />
                </td>

                <td>
                  ₹{order.total_amount.toLocaleString()}
                </td>

                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------ */
/* Status Badge */
/* ------------------ */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-700',
    with_customer: 'bg-yellow-100 text-yellow-700',
    returned: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
        colors[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
