// src/app/(customer)/cart/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useCartStore } from '@/store/cart/cartStore';
import { useRequireAuth } from '@/lib/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Trash2, ShoppingBag, Plus, Minus, Clock } from 'lucide-react';
import Image from 'next/image';

// Helper function to ensure image URLs are properly formatted
const getImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  return `/${url}`;
};

export default function CartPage() {
  useRequireAuth();
  const router = useRouter();
  const { items, removeItem, getTotalAmount, getTotalDeposit, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [showExpressCheckout, setShowExpressCheckout] = useState(false);

  const totalAmount = getTotalAmount();
  const totalDeposit = getTotalDeposit();
  const deliveryCharges = 0; // Free delivery as per design

  if (items.length === 0) {
    return (
      <CustomerDashboardLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag size={64} className="mx-auto text-foreground-muted mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-foreground-secondary mb-6">
            Add some products to get started
          </p>
          <Button onClick={() => router.push('/customer/products')}>
            Browse Products
          </Button>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-foreground-secondary mb-6">
          Add to Cart {'>'} Address {'>'} Payment
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={index} className="pb-6 border-b border-foreground-secondary/20 last:border-0">
                      <div className="flex gap-4 mb-4">
                        <div className="relative w-20 h-20 flex-shrink-0 bg-background-tertiary rounded-lg overflow-hidden">
                          {item.product.images && item.product.images.length > 0 && getImageUrl(item.product.images[0]) ? (
                            <Image
                              src={getImageUrl(item.product.images[0])}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ShoppingBag className="text-foreground-muted" size={24} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-foreground-secondary mb-2">
                            {formatCurrency(item.pricing.subtotal)}
                          </p>
                          <p className="text-xs text-foreground-secondary">
                            Date and time for which the product is rented.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 border border-foreground-secondary/30 rounded px-3 h-9">
                          <button className="text-foreground-secondary hover:text-foreground">
                            <Minus size={16} />
                          </button>
                          <span className="text-foreground font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button className="text-foreground-secondary hover:text-foreground">
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.product._id, item.variant?._id)}
                        >
                          Remove
                        </Button>
                        <Button variant="outline" size="sm">
                          Save For Later
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => router.push('/customer/products')}
                  >
                    Continue Shopping {'>'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Rental Period & Summary */}
          <div className="space-y-6">
            {/* Rental Period */}
            <Card>
              <CardHeader>
                <CardTitle>Rental Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border border-foreground-secondary/30 rounded px-3 py-2">
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="flex-1 bg-transparent outline-none text-sm text-foreground"
                    />
                    <Clock size={16} className="text-foreground-secondary" />
                    <input
                      type="time"
                      defaultValue="00:00:00"
                      className="bg-transparent outline-none text-sm text-foreground w-24"
                    />
                  </div>

                  <div className="flex items-center gap-2 border border-foreground-secondary/30 rounded px-3 py-2">
                    <input
                      type="date"
                      defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                      className="flex-1 bg-transparent outline-none text-sm text-foreground"
                    />
                    <Clock size={16} className="text-foreground-secondary" />
                    <input
                      type="time"
                      defaultValue="00:00:00"
                      className="bg-transparent outline-none text-sm text-foreground w-24"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-secondary">Delivery Charges</span>
                    <span className="font-medium text-foreground">
                      {deliveryCharges === 0 ? '-' : formatCurrency(deliveryCharges)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-secondary">Sub Total</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-foreground-secondary/20">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-foreground">
                        {formatCurrency(totalAmount + totalDeposit)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    fullWidth
                    variant="outline"
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                  >
                    Apply Coupon
                  </Button>

                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => setShowExpressCheckout(true)}
                  >
                    Pay with Save Card
                  </Button>

                  <Button fullWidth onClick={() => router.push('/customer/checkout/new')}>
                    Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Express Checkout Modal */}
        {showExpressCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Express Checkout</CardTitle>
              <button
                onClick={() => setShowExpressCheckout(false)}
                className="text-foreground-secondary hover:text-foreground"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Card Details
                  </label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full px-3 py-2 border border-foreground-secondary/30 rounded bg-background text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-foreground-secondary/30 rounded bg-background text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-foreground-secondary/30 rounded bg-background text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-foreground-secondary/30 rounded bg-background text-foreground outline-none focus:border-primary mb-3"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-foreground-secondary/30 rounded bg-background text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-foreground-secondary/30 rounded bg-background text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-foreground-secondary/30 rounded bg-background text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Country
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-foreground-secondary/30 rounded bg-background text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button fullWidth size="lg">
                    Pay Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </CustomerDashboardLayout>
  );
}