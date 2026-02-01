// src/app/(vendor)/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { useRequireRole } from '@/lib/hooks/useAuth';
import { dashboardApi } from '@/lib/api/dashboard';
import { VendorDashboardStats, UserRole } from '@/types/models';
import { formatCurrency } from '@/lib/utils';
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ALLOWED_ROLES: UserRole[] = ['vendor'];

export default function VendorDashboardPage() {
  const { user, isLoading: authLoading } = useRequireRole(ALLOWED_ROLES);
  const [stats, setStats] = useState<VendorDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || user.role !== 'vendor') {
        console.log('Skipping fetch - user not ready or not vendor');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching vendor stats...', { user: user?.email, role: user?.role });
        const data = await dashboardApi.getVendorStats();
        console.log('Vendor stats received:', data);
        setStats(data);
        setError('');
      } catch (error: any) {
        console.error('Failed to fetch stats:', error);
        console.error('Error details:', error.response?.data);
        const errorMsg = error.response?.data?.error || error.message || 'Failed to load dashboard stats';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.email, user?.role]);

  if (authLoading || isLoading) {
    return (
      <DashboardLayout role="vendor">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="vendor">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Dashboard
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
            <p className="font-semibold mb-1">Error loading dashboard</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2">Please check console for more details or contact support.</p>
          </div>
        )}

        {/* Debug Info in Development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-info/10 border border-info/20 rounded-lg text-info text-sm">
            <p><strong>User:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Stats Loaded:</strong> {stats ? 'Yes' : 'No'}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    Total Rentals
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalOrders || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Package className="text-purple-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    Total Earnings
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                  <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <TrendingUp size={12} /> +15%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    Active Rentals
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.activeRentals || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-blue-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    This Month
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.recentOrders?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="text-orange-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Rentals */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Rentals</CardTitle>
              <a href="/vendor/orders" className="text-sm text-primary hover:underline">
                View All →
              </a>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-foreground-secondary/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-secondary">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-secondary">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-secondary">
                        Start Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-secondary">
                        End Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-secondary">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-foreground-secondary">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.slice(0, 5).map((order) => {
                      const productNames = order.lines?.map(line => 
                        typeof line.product_id === 'object' ? line.product_id.name : line.product_name || 'Product'
                      ).join(', ') || order.order_number;
                      
                      return (
                        <tr key={order._id} className="border-b border-foreground-secondary/5 hover:bg-background-tertiary/50">
                          <td className="py-4 px-4 text-foreground">
                            <div className="font-medium">{productNames}</div>
                            <div className="text-xs text-foreground-secondary">Order: {order.order_number}</div>
                          </td>
                          <td className="py-4 px-4 text-foreground">
                            {typeof order.customer_id === 'object'
                              ? order.customer_id.name
                              : 'Customer'}
                          </td>
                          <td className="py-4 px-4 text-foreground-secondary text-sm">
                            {order.pickup_date 
                              ? new Date(order.pickup_date).toLocaleDateString()
                              : new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-foreground-secondary text-sm">
                            {order.return_date 
                              ? new Date(order.return_date).toLocaleDateString()
                              : 'TBD'}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                              {order.status === 'with_customer' ? 'With Customer' : order.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <a 
                              href={`/vendor/orders/${order._id}`}
                              className="text-primary hover:underline text-sm"
                            >
                              View Order
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-foreground-secondary py-8">
                No active rentals
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        Order #{order.order_number}
                      </p>
                      <p className="text-sm text-foreground-secondary">
                        {typeof order.customer_id === 'object'
                          ? order.customer_id.name
                          : 'Customer'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <p className="text-sm text-foreground-secondary capitalize">
                        {order.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-foreground-secondary py-8">
                No recent orders
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}