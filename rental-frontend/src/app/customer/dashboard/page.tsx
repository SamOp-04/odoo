'use client';

import { useEffect, useState } from 'react';
import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';

interface Order {
  _id: string;
  order_number: string;
  status: string;
  total_amount: number;
  createdAt: string;
}

interface Invoice {
  _id: string;
  invoice_number: string;
  total_amount: number;
  status: string;
  createdAt: string;
}

interface DashboardData {
  totalOrders: number;
  activeOrders: number;
  totalSpent: number;
  recentOrders: Order[];
  recentInvoices: Invoice[];
}

export default function CustomerDashboardPage() {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/customer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Failed to load dashboard');
        }

        const result = await res.json();
        setData(result);
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
    <CustomerDashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Orders"
          value={data.totalOrders}
        />
        <StatCard
          title="Active Rentals"
          value={data.activeOrders}
        />
        <StatCard
          title="Total Spent"
          value={`₹${data.totalSpent.toLocaleString()}`}
        />
      </div>

      {/* RECENT ORDERS */}
      <section className="space-y-3">
        <h2 className="font-medium">Recent Orders</h2>

        <div className="rounded bg-white p-4 shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Order</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 font-medium">
                    {order.order_number}
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

              {data.recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500"
                  >
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* RECENT INVOICES */}
      <section className="space-y-3">
        <h2 className="font-medium">Recent Invoices</h2>

        <div className="rounded bg-white p-4 shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Invoice</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {data.recentInvoices.map((invoice) => (
                <tr key={invoice._id} className="border-b">
                  <td className="py-2 font-medium">
                    {invoice.invoice_number}
                  </td>
                  <td>
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>
                  <td>
                    ₹{invoice.total_amount.toLocaleString()}
                  </td>
                  <td>
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {data.recentInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500"
                  >
                    No invoices yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      </div>
    </CustomerDashboardLayout>
  );
}

/* ------------------ */
/* COMPONENTS */
/* ------------------ */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded bg-white p-4 shadow">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

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

function InvoiceStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    sent: 'bg-blue-100 text-blue-700',
    overdue: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
        styles[status] || styles.draft
      }`}
    >
      {status}
    </span>
  );
}
