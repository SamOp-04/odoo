// src/app/(customer)/cart/page.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useCartStore } from '@/store/cart/cartStore';
import { useRequireAuth } from '@/lib/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function CartPage() {
  useRequireAuth();
  const router = useRouter();
  const { items, removeItem, getTotalAmount, getTotalDeposit, clearCart } = useCartStore();

  const totalAmount = getTotalAmount();
  const totalDeposit = getTotalDeposit();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-background-tertiary rounded-lg overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="text-foreground-muted" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.product.name}
                      </h3>
                      {item.variant && (
                        <p className="text-sm text-foreground-secondary mb-2">
                          Variant: {item.variant.name}
                        </p>
                      )}
                      <div className="space-y-1 text-sm text-foreground-secondary">
                        <p>Quantity: {item.quantity}</p>
                        <p>Period: {formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                        <p>Duration: {item.pricing.duration} {item.durationType}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground mb-2">
                        {formatCurrency(item.pricing.subtotal)}
                      </p>
                      <p className="text-sm text-foreground-secondary mb-4">
                        Deposit: {formatCurrency(item.pricing.deposit)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product._id, item.variant?._id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Rental Total</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Security Deposit</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(totalDeposit)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-foreground-secondary/20">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(totalAmount + totalDeposit)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={() => router.push('/customer/checkout')}>
                  Proceed to Checkout
                </Button>

                <Button
                  variant="ghost"
                  fullWidth
                  size="sm"
                  className="mt-2"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}