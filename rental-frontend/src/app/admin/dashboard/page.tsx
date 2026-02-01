'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Package, Building2 } from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-300 mt-1">System-wide overview and performance metrics</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <DashboardCard 
          title="Total Revenue" 
          value={data.totalRevenue >= 100000 ? `₹${(data.totalRevenue / 100000).toFixed(2)}L` : `₹${data.totalRevenue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          trend="+15%"
          bgColor="from-blue-500 to-blue-600"
        />
        <DashboardCard 
          title="Total Orders" 
          value={data.totalOrders}
          icon={ShoppingBag}
          trend="+8%"
          bgColor="from-indigo-500 to-indigo-600"
        />
        <DashboardCard 
          title="Active Vendors" 
          value={data.ordersByStatus.length}
          icon={Building2}
          bgColor="from-purple-500 to-purple-600"
        />
        <DashboardCard 
          title="Active Products" 
          value={data.totalProducts}
          icon={Package}
          bgColor="from-pink-500 to-pink-600"
        />
      </div>

      {/* ORDER STATUS BREAKDOWN */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-white">Order Status Breakdown</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {data.ordersByStatus.map((s) => {
            const colors: Record<string, { bg: string; text: string }> = {
              confirmed: { bg: 'bg-blue-900 border border-blue-700', text: 'text-blue-400' },
              with_customer: { bg: 'bg-yellow-900 border border-yellow-700', text: 'text-yellow-400' },
              returned: { bg: 'bg-green-900 border border-green-700', text: 'text-green-400' },
              cancelled: { bg: 'bg-red-900 border border-red-700', text: 'text-red-400' },
            };
            const color = colors[s._id] || { bg: 'bg-gray-800 border border-gray-700', text: 'text-gray-400' };
            
            return (
              <div key={s._id} className={`rounded-lg ${color.bg} p-6 text-center`}>
                <p className={`text-4xl font-bold mb-2 ${color.text}`}>{s.count}</p>
                <p className="text-sm font-medium text-gray-300 capitalize">
                  {s._id.replace('_', ' ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-white">Recent Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Order ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-4 font-medium text-white">{order.order_number}</td>
                  <td className="py-4 px-4 text-gray-300">
                    {order.customer_id?.company_name ||
                      order.customer_id?.name ||
                      '-'}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-white">
                    ₹{order.total_amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
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
    confirmed: 'bg-orange-900 text-orange-300 border-orange-700',
    with_customer: 'bg-yellow-900 text-yellow-300 border-yellow-700',
    returned: 'bg-green-900 text-green-300 border-green-700',
    cancelled: 'bg-red-900 text-red-300 border-red-700',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        colors[status] || 'bg-gray-800 text-gray-300 border-gray-700'
      }`}
    >
      {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
    </span>
  );
}

/* ------------------ */
/* Reusable Card */
/* ------------------ */
function DashboardCard({
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
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${bgColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
            ↑ {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-gray-300 text-sm font-medium">{title}</p>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
