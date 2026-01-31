'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { ordersApi, paymentsApi } from '@/lib/api';
import { useRequireAuth } from '@/lib/hooks/useAuth';
import { RentalOrder, Payment } from '@/types/models';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { Package, Calendar, MapPin, CreditCard, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function OrderDetailPage() {
  useRequireAuth();
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await ordersApi.getById(params.id as string);
        setOrder(orderData);

        const paymentData = await paymentsApi.getByOrder(params.id as string);
        setPayments(paymentData);
      } catch (error) {
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.id]);

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setIsCancelling(true);
      await ordersApi.cancel(order._id);
      toast.success('Order cancelled successfully');
      setCancelModal(false);
      
      // Refresh order data
      const updatedOrder = await ordersApi.getById(order._id);
      setOrder(updatedOrder);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Order not found</h1>
          <Button onClick={() => router.push('/customer/orders')}>View All Orders</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const customer = typeof order.customer_id === 'object' ? order.customer_id : null;
  const vendor = typeof order.vendor_id === 'object' ? order.vendor_id : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order #{order.order_number}
            </h1>
            <p className="text-foreground-secondary">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <Badge status={order.status} className="text-base px-4 py-2">
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.lines.map((line, index) => {
                    const product = typeof line.product_id === 'object' ? line.product_id : null;
                    const productImage = line.product_image || (product?.images?.[0]);

                    return (
                      <div key={index} className="flex gap-4 pb-4 border-b border-foreground-secondary/10 last:border-0">
                        <div className="relative w-20 h-20 flex-shrink-0 bg-background-tertiary rounded-lg overflow-hidden">
                          {productImage ? (
                            <Image
                              src={productImage}
                              alt={line.product_name || product?.name || 'Product'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="text-foreground-muted" size={24} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {line.product_name || product?.name || 'Product'}
                          </h3>
                          <div className="space-y-1 text-sm text-foreground-secondary">
                            <p>Quantity: {line.quantity}</p>
                            <p>
                              Period: {formatDate(line.rental_start_date)} - {formatDate(line.rental_end_date)}
                            </p>
                            <p>Price: {formatCurrency(line.unit_price)} × {line.quantity}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {formatCurrency(line.subtotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            {payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment._id}
                        className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCard className="text-success" size={20} />
                          <div>
                            <p className="font-medium text-foreground">
                              {payment.payment_method.toUpperCase()}
                            </p>
                            <p className="text-sm text-foreground-secondary">
                              {formatDateTime(payment.payment_date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">
                            {formatCurrency(payment.amount)}
                          </p>
                          <Badge variant="success" className="text-xs">
                            {payment.payment_status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-foreground">Order Confirmed</p>
                      <p className="text-sm text-foreground-secondary">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {order.pickup_date && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-foreground">Picked Up</p>
                        <p className="text-sm text-foreground-secondary">
                          {formatDateTime(order.pickup_date)}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.actual_return_date && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-foreground">Returned</p>
                        <p className="text-sm text-foreground-secondary">
                          {formatDateTime(order.actual_return_date)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      order.status === 'returned' ? 'bg-success' : 'bg-foreground-secondary'
                    }`}></div>
                    <div>
                      <p className="font-medium text-foreground">Expected Return</p>
                      <p className="text-sm text-foreground-secondary">
                        {formatDate(order.return_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Rental Amount</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Deposit Paid</span>
                    <span className="font-medium text-success">
                      {formatCurrency(order.deposit_paid)}
                    </span>
                  </div>
                  {order.late_fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-foreground-secondary">Late Fee</span>
                      <span className="font-medium text-error">
                        {formatCurrency(order.late_fee)}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-foreground-secondary/20">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(order.total_amount + order.late_fee)}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge variant={order.full_payment_made ? 'success' : 'warning'} className="w-full justify-center">
                  {order.payment_status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            {/* Vendor Info */}
            {vendor && (
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">{vendor.company_name}</p>
                    <p className="text-sm text-foreground-secondary">{vendor.email}</p>
                    {vendor.phone && (
                      <p className="text-sm text-foreground-secondary">{vendor.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {order.status === 'confirmed' && (
              <Button
                variant="danger"
                fullWidth
                onClick={() => setCancelModal(true)}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This action cannot be undone."
      >
        <div className="flex space-x-3 mt-6">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setCancelModal(false)}
          >
            Keep Order
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={handleCancelOrder}
            isLoading={isCancelling}
          >
            Cancel Order
          </Button>
        </div>
      </Modal>
    </div>
  );
}