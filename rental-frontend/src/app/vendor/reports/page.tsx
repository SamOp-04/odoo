'use client';

import { useEffect, useState } from 'react';

interface RevenueRow {
  _id: {
    year: number;
    month: number;
  };
  totalRevenue: number;
  totalTax: number;
  count: number;
}

interface ProductReport {
  _id: string;
  productName: string;
  totalRentals: number;
  totalQuantity: number;
  totalRevenue: number;
}

interface Order {
  _id: string;
  order_number: string;
  status: string;
  total_amount: number;
  createdAt: string;
}

export default function VendorReportsPage() {
  const [revenue, setRevenue] = useState<RevenueRow[]>([]);
  const [products, setProducts] = useState<ProductReport[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Unauthorized');
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [revRes, prodRes, ordRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/reports/revenue`,
            { headers }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/reports/products`,
            { headers }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/reports/orders`,
            { headers }
          ),
        ]);

        if (!revRes.ok || !prodRes.ok || !ordRes.ok) {
          throw new Error('Failed to load reports');
        }

        setRevenue(await revRes.json());
        setProducts(await prodRes.json());
        setOrders(await ordRes.json());
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading reports…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Reports</h1>

      {/* REVENUE */}
      <section className="space-y-3">
        <h2 className="font-medium">Revenue (Monthly)</h2>
        <div className="rounded bg-white p-4 shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Month</th>
                <th>Invoices</th>
                <th>Tax</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((row, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">
                    {row._id.month}/{row._id.year}
                  </td>
                  <td>{row.count}</td>
                  <td>₹{row.totalTax.toLocaleString()}</td>
                  <td className="font-medium">
                    ₹{row.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}

              {revenue.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500"
                  >
                    No revenue data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="space-y-3">
        <h2 className="font-medium">Product Performance</h2>
        <div className="rounded bg-white p-4 shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Product</th>
                <th>Rentals</th>
                <th>Quantity</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-2 font-medium">
                    {p.productName}
                  </td>
                  <td>{p.totalRentals}</td>
                  <td>{p.totalQuantity}</td>
                  <td>
                    ₹{p.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500"
                  >
                    No product data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ORDERS */}
      <section className="space-y-3">
        <h2 className="font-medium">Orders</h2>
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
              {orders.map((o) => (
                <tr key={o._id} className="border-b">
                  <td className="py-2 font-medium">
                    {o.order_number}
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td>
                    ₹{o.total_amount.toLocaleString()}
                  </td>
                  <td>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500"
                  >
                    No orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
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
