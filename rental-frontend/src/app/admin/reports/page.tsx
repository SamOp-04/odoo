'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RevenueReport {
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

export default function AdminReportsPage() {
  const [revenue, setRevenue] = useState<RevenueReport[]>([]);
  const [products, setProducts] = useState<ProductReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized');
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    Promise.all([
      fetch(`${API_URL}/api/reports/revenue`, { headers }),
      fetch(`${API_URL}/api/reports/products`, { headers }),
    ])
      .then(async ([revRes, prodRes]) => {
        if (!revRes.ok || !prodRes.ok) {
          throw new Error('Failed to load reports');
        }

        const revData = await revRes.json();
        const prodData = await prodRes.json();

        setRevenue(revData);
        setProducts(prodData);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading reports…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Reports & Analytics</h1>

      {/* ===== Revenue Report ===== */}
      <section className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-medium mb-4">Monthly Revenue</h2>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Month</th>
                <th className="p-2 border">Invoices</th>
                <th className="p-2 border">Tax</th>
                <th className="p-2 border">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {r._id.month}/{r._id.year}
                  </td>
                  <td className="p-2 border text-center">{r.count}</td>
                  <td className="p-2 border">₹{r.totalTax.toFixed(2)}</td>
                  <td className="p-2 border font-medium">
                    ₹{r.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
              {revenue.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No revenue data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== Product Performance ===== */}
      <section className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-medium mb-4">Product Performance</h2>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Rentals</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{p.productName}</td>
                  <td className="p-2 border text-center">{p.totalRentals}</td>
                  <td className="p-2 border text-center">{p.totalQuantity}</td>
                  <td className="p-2 border font-medium">
                    ₹{p.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No product data
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
