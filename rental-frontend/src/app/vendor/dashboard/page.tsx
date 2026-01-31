// src/app/(vendor)/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { useRequireRole } from '@/lib/hooks/useAuth';
import { dashboardApi } from '@/lib/api/dashboard';
import { VendorDashboardStats } from '@/types/models';
import { formatCurrency } from '@/lib/utils';
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function VendorDashboardPage() {
  const { user, isLoading: authLoading } = useRequireRole(['vendor']);
  const [stats, setStats] = useState<VendorDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getVendorStats();
        setStats(data);
      } catch (error: any) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'vendor') {
      fetchStats();
    }
  }, [user]);

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalProducts || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="text-primary" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalOrders || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="text-success" size={24} />
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
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-warning" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-info" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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