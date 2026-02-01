'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { DollarSign, ShoppingBag, Users, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  completedOrders: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

interface OrderStatusBreakdown {
  confirmed: number;
  picked_up: number;
  with_customer: number;
  returned: number;
  cancelled: number;
}

interface RevenueByDay {
  date: string;
  revenue: number;
}

interface TopProduct {
  productName: string;
  revenue: number;
  orders: number;
}

interface MonthPerformance {
  rentalsThisMonth: number;
  earningsThisMonth: number;
  rentalsTarget: number;
  earningsTarget: number;
}

export default function VendorReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<OrderStatusBreakdown | null>(null);
  const [revenueByDay, setRevenueByDay] = useState<RevenueByDay[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [monthPerformance, setMonthPerformance] = useState<MonthPerformance | null>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized - Please login');
        return;
      }

      // Fetch orders and invoices to calculate stats
      const [ordersRes, invoicesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!ordersRes.ok || !invoicesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const orders = await ordersRes.json();
      const invoices = await invoicesRes.json();

      // Calculate stats
      calculateStats(orders, invoices);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      toast.error(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders: any[], invoices: any[]) => {
    // Total Revenue from paid invoices
    const totalRevenue = invoices
      .filter((inv: any) => inv.status === 'paid')
      .reduce((sum: number, inv: any) => sum + inv.total_amount, 0);

    // Total Orders
    const totalOrders = orders.length;

    // Active Customers (unique customers from orders)
    const uniqueCustomers = new Set(
      orders.map((order: any) => order.customer_id?._id || order.customer_id)
    );
    const activeCustomers = uniqueCustomers.size;

    // Completed Orders (returned status)
    const completedOrders = orders.filter((order: any) => order.status === 'returned').length;

    setStats({
      totalRevenue,
      totalOrders,
      activeCustomers,
      completedOrders,
      revenueGrowth: 15, // Mock percentage
      ordersGrowth: 8, // Mock percentage
    });

    // Order Status Breakdown
    const breakdown: OrderStatusBreakdown = {
      confirmed: orders.filter((o: any) => o.status === 'confirmed').length,
      picked_up: orders.filter((o: any) => o.status === 'picked_up').length,
      with_customer: orders.filter((o: any) => o.status === 'with_customer').length,
      returned: orders.filter((o: any) => o.status === 'returned').length,
      cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
    };
    setStatusBreakdown(breakdown);

    // Revenue by Day (last 7 days)
    const last7Days = getLast7Days();
    const revenueByDayData = last7Days.map((date) => {
      const dayInvoices = invoices.filter((inv: any) => {
        const invDate = new Date(inv.createdAt).toDateString();
        return invDate === date.toDateString() && inv.status === 'paid';
      });
      const dayRevenue = dayInvoices.reduce((sum: number, inv: any) => sum + inv.total_amount, 0);
      return {
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue,
      };
    });
    setRevenueByDay(revenueByDayData);

    // Top 5 Products by Revenue
    const productRevenue = new Map<string, { name: string; revenue: number; orders: number }>();
    
    orders.forEach((order: any) => {
      order.lines?.forEach((line: any) => {
        const productName = line.product_name || 'Unknown';
        const existing = productRevenue.get(productName) || { name: productName, revenue: 0, orders: 0 };
        existing.revenue += line.subtotal || 0;
        existing.orders += 1;
        productRevenue.set(productName, existing);
      });
    });

    const topProductsData = Array.from(productRevenue.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({
        productName: p.name,
        revenue: p.revenue,
        orders: p.orders,
      }));
    setTopProducts(topProductsData);

    // This Month Performance
    const now = new Date();
    const thisMonthOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    });

    const thisMonthInvoices = invoices.filter((inv: any) => {
      const invDate = new Date(inv.createdAt);
      return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear() && inv.status === 'paid';
    });

    const earningsThisMonth = thisMonthInvoices.reduce((sum: number, inv: any) => sum + inv.total_amount, 0);

    setMonthPerformance({
      rentalsThisMonth: thisMonthOrders.length,
      earningsThisMonth,
      rentalsTarget: 100,
      earningsTarget: 200000,
    });
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  if (loading) {
    return (
      <DashboardLayout role="vendor">
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const maxRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 1);
  const maxProductRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);

  return (
    <DashboardLayout role="vendor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-500" size={24} />
                </div>
                <span className="text-sm text-success flex items-center gap-1">
                  <TrendingUp size={14} /> +{stats?.revenueGrowth}%
                </span>
              </div>
              <p className="text-sm text-foreground-secondary mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="text-blue-500" size={24} />
                </div>
                <span className="text-sm text-success flex items-center gap-1">
                  <TrendingUp size={14} /> +{stats?.ordersGrowth}%
                </span>
              </div>
              <p className="text-sm text-foreground-secondary mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-foreground">{stats?.totalOrders || 0}</p>
            </CardContent>
          </Card>

          {/* Active Customers */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-foreground-secondary mb-1">Active Customers</p>
              <p className="text-3xl font-bold text-foreground">{stats?.activeCustomers || 0}</p>
            </CardContent>
          </Card>

          {/* Completed Orders */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-orange-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-foreground-secondary mb-1">Completed Orders</p>
              <p className="text-3xl font-bold text-foreground">{stats?.completedOrders || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Over Last 7 Days */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {revenueByDay.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:from-green-600 hover:to-green-500 transition-all cursor-pointer relative group"
                        style={{
                          height: `${(day.revenue / maxRevenue) * 100}%`,
                          minHeight: day.revenue > 0 ? '8px' : '0px',
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border border-foreground-secondary/20 px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatCurrency(day.revenue)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-foreground-secondary">{day.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Products by Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Products by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group"
                          style={{
                            height: `${(product.revenue / maxProductRevenue) * 100}%`,
                            minHeight: '8px',
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border border-foreground-secondary/20 px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {formatCurrency(product.revenue)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-foreground-secondary text-center line-clamp-2">
                        {product.productName}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground-secondary">
                    <div className="text-center">
                      <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No product data available</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-background-secondary rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-blue-500 mb-2">
                  {statusBreakdown?.confirmed || 0}
                </p>
                <p className="text-sm text-foreground-secondary">Confirmed</p>
              </div>
              <div className="bg-background-secondary rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-purple-500 mb-2">
                  {statusBreakdown?.picked_up || 0}
                </p>
                <p className="text-sm text-foreground-secondary">Picked Up</p>
              </div>
              <div className="bg-background-secondary rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-orange-500 mb-2">
                  {statusBreakdown?.with_customer || 0}
                </p>
                <p className="text-sm text-foreground-secondary">With Customer</p>
              </div>
              <div className="bg-background-secondary rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-green-500 mb-2">
                  {statusBreakdown?.returned || 0}
                </p>
                <p className="text-sm text-foreground-secondary">Returned</p>
              </div>
              <div className="bg-background-secondary rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-gray-500 mb-2">
                  {statusBreakdown?.cancelled || 0}
                </p>
                <p className="text-sm text-foreground-secondary">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month Performance */}
        <Card>
          <CardHeader>
            <CardTitle>This Month Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Rentals This Month */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-foreground-secondary">Rentals This Month</p>
                  <p className="text-2xl font-bold text-foreground">
                    {monthPerformance?.rentalsThisMonth || 0}
                  </p>
                </div>
                <div className="w-full bg-background-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        ((monthPerformance?.rentalsThisMonth || 0) / (monthPerformance?.rentalsTarget || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-foreground-secondary mt-2">
                  Target: {monthPerformance?.rentalsTarget || 0}
                </p>
              </div>

              {/* Earnings This Month */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-foreground-secondary">Earnings This Month</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(monthPerformance?.earningsThisMonth || 0)}
                  </p>
                </div>
                <div className="w-full bg-background-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        ((monthPerformance?.earningsThisMonth || 0) / (monthPerformance?.earningsTarget || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-foreground-secondary mt-2">
                  Target: {formatCurrency(monthPerformance?.earningsTarget || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
