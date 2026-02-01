'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Search, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

interface OrderLine {
  product_id: {
    _id: string;
    name: string;
    images?: string[];
  } | string;
  product_name: string;
  quantity: number;
  rental_start_date?: string;
  rental_end_date?: string;
  unit_price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  order_number: string;
  status: 'confirmed' | 'picked_up' | 'with_customer' | 'returned' | 'cancelled';
  total_amount: number;
  pickup_date?: string;
  return_date?: string;
  actual_return_date?: string;
  lines: OrderLine[];
  customer_id?: {
    _id: string;
    name: string;
    email: string;
    company_name?: string;
  };
  createdAt: string;
}

const STATUS_COLORS = {
  confirmed: 'bg-blue-500 text-white',
  picked_up: 'bg-purple-500 text-white',
  with_customer: 'bg-orange-500 text-white',
  returned: 'bg-green-500 text-white',
  cancelled: 'bg-gray-500 text-white',
};

const STATUS_LABELS = {
  confirmed: 'Confirmed',
  picked_up: 'Picked Up',
  with_customer: 'With Customer',
  returned: 'Returned',
  cancelled: 'Cancelled',
};

export default function VendorOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized - Please login');
        router.push('/auth/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const data = await res.json();
      console.log('Orders fetched:', data);
      setOrders(data);
      setFilteredOrders(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      toast.error(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((order) => {
        const query = searchQuery.toLowerCase();
        const matchesOrderNumber = order.order_number.toLowerCase().includes(query);
        const matchesProduct = order.lines.some((line) =>
          line.product_name.toLowerCase().includes(query)
        );
        return matchesOrderNumber || matchesProduct;
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter - filter by rental period
    if (startDate) {
      filtered = filtered.filter((order) => {
        const pickupDate = order.pickup_date ? new Date(order.pickup_date) : null;
        const returnDate = order.return_date ? new Date(order.return_date) : null;
        const filterStartDate = new Date(startDate);
        filterStartDate.setHours(0, 0, 0, 0);
        
        // Order overlaps if pickup is before/on filter start OR return is after/on filter start
        if (pickupDate) {
          pickupDate.setHours(0, 0, 0, 0);
          // Check if pickup date is on or after the start date
          return pickupDate >= filterStartDate;
        }
        return false;
      });
    }

    if (endDate) {
      filtered = filtered.filter((order) => {
        const pickupDate = order.pickup_date ? new Date(order.pickup_date) : null;
        const returnDate = order.return_date ? new Date(order.return_date) : null;
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999);
        
        // Order overlaps if return is before/on filter end OR pickup is before/on filter end
        if (returnDate) {
          returnDate.setHours(23, 59, 59, 999);
          // Check if return date is on or before the end date
          return returnDate <= filterEndDate;
        } else if (pickupDate) {
          // If no return date, check pickup date
          pickupDate.setHours(0, 0, 0, 0);
          return pickupDate <= filterEndDate;
        }
        return false;
      });
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, startDate, endDate, orders]);

  const markPickedUp = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/pickup`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to mark as picked up');
      }

      toast.success('Order marked as picked up');
      await fetchOrders();
    } catch (err: any) {
      console.error('Error marking as picked up:', err);
      toast.error(err.message || 'Failed to mark as picked up');
    } finally {
      setActionLoading(null);
    }
  };

  const markReturned = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/return`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to mark as returned');
      }

      toast.success('Order marked as returned');
      await fetchOrders();
    } catch (err: any) {
      console.error('Error marking as returned:', err);
      toast.error(err.message || 'Failed to mark as returned');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getProductNames = (lines: OrderLine[]) => {
    return lines.map(line => line.product_name).join(', ');
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

  return (
    <DashboardLayout role="vendor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" size={18} />
                <input
                  type="text"
                  placeholder="Search by Order ID or Product."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="picked_up">Picked Up</option>
                <option value="with_customer">With Customer</option>
                <option value="returned">Returned</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Start Date */}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* End Date */}
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-2 rounded-lg border border-foreground-secondary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error">
            {error}
          </div>
        )}

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <p className="text-foreground-secondary text-lg">
                {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-secondary border-b border-foreground-secondary/10">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                        Order ID
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                        Customer
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                        Products
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                        Rental Period
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                        Total
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-foreground-secondary/10 hover:bg-background-secondary/50 transition-colors"
                      >
                        {/* Order ID */}
                        <td className="py-4 px-6">
                          <span className="font-mono text-primary font-semibold">
                            {order.order_number}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-foreground">
                              {order.customer_id?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-foreground-secondary">
                              {order.customer_id?.email || ''}
                            </div>
                          </div>
                        </td>

                        {/* Products */}
                        <td className="py-4 px-6">
                          <div className="text-foreground">
                            {getProductNames(order.lines)}
                          </div>
                        </td>

                        {/* Rental Period */}
                        <td className="py-4 px-6">
                          <div className="text-sm text-foreground">
                            <div>{formatDate(order.pickup_date)}</div>
                            <div className="text-foreground-secondary">
                              to {formatDate(order.return_date)}
                            </div>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-4 px-6">
                          <span className="font-semibold text-foreground">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              STATUS_COLORS[order.status]
                            }`}
                          >
                            {STATUS_LABELS[order.status]}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/vendor/orders/${order._id}`)}
                            >
                              <Eye size={16} className="mr-1" />
                              View
                            </Button>

                            {order.status === 'confirmed' && (
                              <Button
                                size="sm"
                                onClick={() => markPickedUp(order._id)}
                                disabled={actionLoading === order._id}
                                className="bg-purple-500 hover:bg-purple-600 text-white"
                              >
                                {actionLoading === order._id ? (
                                  <Spinner size="sm" />
                                ) : (
                                  'Mark Picked Up'
                                )}
                              </Button>
                            )}

                            {(order.status === 'picked_up' || order.status === 'with_customer') && (
                              <Button
                                size="sm"
                                onClick={() => markReturned(order._id)}
                                disabled={actionLoading === order._id}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                {actionLoading === order._id ? (
                                  <Spinner size="sm" />
                                ) : (
                                  'Mark Returned'
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
