'use client';

import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  order_number: string;
  status: string;
  total_amount: number;
  customer_id?: {
    name: string;
    company_name?: string;
  };
  vendor_id?: {
    name: string;
    company_name?: string;
  };
}

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: {
    _id: string;
    count: number;
  }[];
  recentOrders: Order[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Unauthorized');
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Failed to load dashboard');
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading dashboard…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <DashboardCard title="Products" value={data.totalProducts} />
        <DashboardCard title="Orders" value={data.totalOrders} />
        <DashboardCard
          title="Revenue"
          value={`₹${data.totalRevenue.toLocaleString()}`}
        />
        <DashboardCard
          title="Order Statuses"
          value={data.ordersByStatus.length}
        />
      </div>

      {/* ORDER STATUS BREAKDOWN */}
      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-3 font-medium">Orders by Status</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {data.ordersByStatus.map((s) => (
            <div key={s._id} className="rounded border p-3 text-sm">
              <p className="font-medium capitalize">{s._id}</p>
              <p className="text-lg">{s.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-3 font-medium">Recent Orders</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-2">{order.order_number}</td>
                <td>
                  {order.customer_id?.company_name ||
                    order.customer_id?.name ||
                    '-'}
                </td>
                <td className="capitalize">{order.status}</td>
                <td>₹{order.total_amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------ */
/* Reusable Card */
/* ------------------ */
function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
