'use client';

import { useEffect, useState } from 'react';

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
  /* CANCEL ORDER */
  /* ------------------ */
  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      setActionLoading(orderId);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/cancel`,
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
    return <p className="text-sm text-gray-500">Loading orders…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded bg-white p-4 shadow"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">
                  {order.order_number}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <StatusBadge status={order.status} />
            </div>

            {/* LINES */}
            <div className="mt-3 space-y-3">
              {order.lines.map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3"
                >
                  {line.product_image && (
                    <img
                      src={line.product_image}
                      alt={line.product_name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {line.product_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {line.quantity}
                    </p>
                  </div>

                  <p className="text-sm">
                    ₹{line.subtotal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <p className="font-semibold">
                Total: ₹{order.total_amount.toLocaleString()}
              </p>

              {order.status === 'confirmed' && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  disabled={actionLoading === order._id}
                  className="rounded border border-red-300 px-3 py-1 text-xs text-red-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            You have no orders yet
          </p>
        )}
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
