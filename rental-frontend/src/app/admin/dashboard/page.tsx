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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">System-wide overview and performance metrics</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <DashboardCard 
          title="Total Revenue" 
          value={`₹${(data.totalRevenue / 100000).toFixed(1)}L`}
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
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Order Status Breakdown</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {data.ordersByStatus.map((s) => {
            const colors: Record<string, { bg: string; text: string }> = {
              confirmed: { bg: 'bg-blue-50', text: 'text-blue-600' },
              with_customer: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
              returned: { bg: 'bg-green-50', text: 'text-green-600' },
              cancelled: { bg: 'bg-red-50', text: 'text-red-600' },
            };
            const color = colors[s._id] || { bg: 'bg-gray-50', text: 'text-gray-600' };
            
            return (
              <div key={s._id} className={`rounded-lg ${color.bg} p-6 text-center`}>
                <p className={`text-4xl font-bold mb-2 ${color.text}`}>{s.count}</p>
                <p className="text-sm font-medium text-gray-600 capitalize">
                  {s._id.replace('_', ' ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Recent Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{order.order_number}</td>
                  <td className="py-4 px-4 text-gray-700">
                    {order.customer_id?.company_name ||
                      order.customer_id?.name ||
                      '-'}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">
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
