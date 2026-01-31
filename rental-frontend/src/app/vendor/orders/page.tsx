'use client';

import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  order_number: string;
  status: string;
  total_amount: number;
  return_date: string;
  customer_id?: {
    name: string;
    company_name?: string;
  };
}

export default function VendorOrdersPage() {
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

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ------------------ */
  /* PICKUP ORDER */
  /* ------------------ */
  const markPickedUp = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/pickup`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Pickup failed');
      }

      await fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Pickup failed');
    } finally {
      setActionLoading(null);
    }
  };

  /* ------------------ */
  /* RETURN ORDER */
  /* ------------------ */
  const markReturned = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/return`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            actualReturnDate: new Date().toISOString(),
            conditionNotes: 'Returned in good condition',
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Return failed');
      }

      await fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Return failed');
    } finally {
      setActionLoading(null);
    }
  };

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
              <th>Status</th>
              <th>Return By</th>
              <th className="text-right">Action</th>
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
                  <StatusBadge status={order.status} />
                </td>

                <td>
                  {order.return_date
                    ? new Date(order.return_date).toLocaleDateString()
                    : '-'}
                </td>

                <td className="text-right space-x-2">
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => markPickedUp(order._id)}
                      disabled={actionLoading === order._id}
                      className="rounded bg-black px-3 py-1 text-xs text-white"
                    >
                      Mark Picked Up
                    </button>
                  )}

                  {order.status === 'with_customer' && (
                    <button
                      onClick={() => markReturned(order._id)}
                      disabled={actionLoading === order._id}
                      className="rounded bg-green-600 px-3 py-1 text-xs text-white"
                    >
                      Mark Returned
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 text-center text-gray-500"
                >
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
  const styles: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-700',
    with_customer: 'bg-yellow-100 text-yellow-700',
    returned: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
        styles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
