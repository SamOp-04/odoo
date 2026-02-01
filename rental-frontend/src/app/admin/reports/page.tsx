'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Building2 } from 'lucide-react';

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
      fetch(`${API_URL}/reports/revenue`, { headers }),
      fetch(`${API_URL}/reports/products`, { headers }),
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
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

  const totalRevenue = revenue.reduce((sum, r) => sum + r.totalRevenue, 0);
  const totalOrders = revenue.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive system analytics and insights</p>
        </div>
        <button className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
          Export Report
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Date Range</label>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard 
          title="Total Revenue" 
          value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
          icon={TrendingUp}
          trend="+15%"
          bgColor="from-blue-500 to-blue-600"
        />
        <MetricCard 
          title="Total Orders" 
          value={totalOrders}
          icon={ShoppingBag}
          trend="+8%"
          bgColor="from-indigo-500 to-indigo-600"
        />
        <MetricCard 
          title="Average Order Value" 
          value={`₹${totalOrders > 0 ? Math.floor(totalRevenue / totalOrders).toLocaleString('en-IN') : 0}`}
          icon={DollarSign}
          bgColor="from-purple-500 to-purple-600"
        />
        <MetricCard 
          title="Active Vendors" 
          value="2"
          icon={Building2}
          bgColor="from-pink-500 to-pink-600"
        />
      </div>

      {/* Revenue by Day - Last 7 Days */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Revenue by Day (Last 7 Days)</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Order Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {revenue.slice(0, 7).map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {r._id.month}/{r._id.year}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    ₹{r.totalRevenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">{r.count}</td>
                  <td className="py-4 px-6 text-right text-gray-700">
                    ₹{Math.floor(r.totalRevenue / r.count).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
              {revenue.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    No revenue data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Top Products</h2>

          <div className="space-y-4">
            {products.slice(0, 5).map((p, index) => (
              <div key={p._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{p.productName}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>{p.totalRentals} rentals</span>
                    <span>•</span>
                    <span>Qty: {p.totalQuantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{(p.totalRevenue / 1000).toFixed(1)}K</p>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="py-8 text-center text-gray-500">No product data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Top Vendors</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">Tech Rentals Pro</p>
                <p className="text-sm text-gray-600">124 orders</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹24.5L</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">Camera Equipment Hub</p>
                <p className="text-sm text-gray-600">98 orders</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹18.9L</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">Event Gear Rentals</p>
                <p className="text-sm text-gray-600">34 orders</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹5.7L</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                  Inactive
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ */
/* Metric Card */
/* ------------------ */
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  bgColor,
}: {
  title: string;
  value: number | string;
  icon: any;
  trend?: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${bgColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
            ↑ {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
