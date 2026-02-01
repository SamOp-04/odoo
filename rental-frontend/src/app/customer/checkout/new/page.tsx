// src/app/customer/checkout/new/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useCartStore } from '@/store/cart/cartStore';
import { useRequireAuth } from '@/lib/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShoppingBag, ChevronLeft, Edit2 } from 'lucide-react';
import Image from 'next/image';

// Helper function to ensure image URLs are properly formatted
const getImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  return `/${url}`;
};

type CheckoutStep = 'delivery' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  useRequireAuth();
  const router = useRouter();
  const { items, getTotalAmount, getTotalDeposit, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'pickup'>('standard');
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [savePaymentDetails, setSavePaymentDetails] = useState(false);

  // Mock customer data
  const customerData = {
    name: 'Customer Name',
    address: 'xxxxxxxx, xxxxxxxxxxxxxx, XXXXX',
  };

  const [formData, setFormData] = useState({
    cardNumber: '',
    name: '',
    email: '',
    address: '',
    address2: '',
    zipCode: '',
    city: '',
    country: '',
  });

  const totalAmount = getTotalAmount();
  const totalDeposit = getTotalDeposit();
  const deliveryCharges = 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirm = () => {
    if (currentStep === 'delivery') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      // Process payment and show confirmation
      setCurrentStep('confirmation');
      // Generate mock order number
      const orderNumber = 'SO' + Math.floor(100000 + Math.random() * 900000);
      sessionStorage.setItem('lastOrderNumber', orderNumber);
    }
  };

  if (items.length === 0 && currentStep !== 'confirmation') {
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

  // Order Summary Component (reusable)
  const OrderSummary = () => (
    <Card>
      <CardContent className="pt-6">
        {items.slice(0, 1).map((item, index) => (
          <div key={index} className="mb-6">
            <div className="flex gap-4 mb-4">
              <div className="relative w-20 h-20 flex-shrink-0 bg-background-tertiary rounded-lg border-2 border-dashed border-foreground-secondary/30">
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
                <p className="text-sm text-foreground-secondary">
                  {formatCurrency(item.pricing.subtotal)}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium text-foreground mb-1">Rental Period</p>
                <p className="text-foreground-secondary">
                  {formatDate(item.startDate)} and time to {formatDate(item.endDate)} and time
                </p>
              </div>

              <div className="pt-3 border-t border-foreground-secondary/20 space-y-2">
                <div className="flex justify-between text-foreground-secondary">
                  <span>Delivery Charges</span>
                  <span>{deliveryCharges === 0 ? '-' : formatCurrency(deliveryCharges)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-foreground-secondary">Sub Total</span>
                  <span className="text-foreground">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-foreground-secondary/20">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatCurrency(totalAmount + totalDeposit)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  // Delivery/Address Step
  const DeliveryStep = () => (
    <div className="space-y-6">
      {/* Delivery Method */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 border border-foreground-secondary/30 rounded cursor-pointer hover:border-primary">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'standard'}
                  onChange={() => setDeliveryMethod('standard')}
                  className="w-4 h-4"
                />
                <span className="font-medium text-foreground">Standard Delivery</span>
              </div>
              <span className="font-semibold text-foreground">Free</span>
            </label>

            <label className="flex items-center justify-between p-4 border border-foreground-secondary/30 rounded cursor-pointer hover:border-primary">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                  className="w-4 h-4"
                />
                <span className="font-medium text-foreground">Pick up from Store</span>
              </div>
              <span className="font-semibold text-foreground">Free</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-foreground-secondary/30 rounded p-4 mb-3">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground text-lg">
                {customerData.name}
              </h3>
              <Button variant="outline" size="sm">
                <Edit2 size={14} className="mr-1" />
              </Button>
            </div>
            <p className="text-sm text-foreground-secondary mb-3">
              {customerData.address}
            </p>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Main Address
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(e) => setSameAsBilling(e.target.checked)}
                className="w-5 h-5"
              />
            </div>
            <span className="text-sm text-foreground">
              If enabled, it will make Billing and Delivery address the same
            </span>
          </label>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button fullWidth size="lg" onClick={handleConfirm}>
          Confirmed {'>'}
        </Button>
        <div className="text-center">
          <span className="text-foreground-secondary">OR</span>
        </div>
        <button
          onClick={() => router.push('/customer/cart')}
          className="text-foreground-secondary hover:text-foreground flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} />
          Back to Cart
        </button>
      </div>
    </div>
  );

  // Payment Step
  const PaymentStep = () => (
    <div className="space-y-6">
      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Card
              </label>
              <p className="text-xs text-foreground-secondary mb-2">Payment Details</p>
              <input
                type="text"
                name="cardNumber"
                placeholder="XXXX XXXX XXXX XXXX"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-foreground-secondary/30 rounded bg-background text-foreground outline-none focus:border-primary"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={savePaymentDetails}
                onChange={(e) => setSavePaymentDetails(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Save my payment details</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Delivery & Billing */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Delivery & Billing</h3>
            <Button variant="outline" size="sm">
              <Edit2 size={14} className="mr-1" />
            </Button>
          </div>
          <div className="border border-foreground-secondary/30 rounded p-4">
            <h4 className="font-semibold text-foreground mb-2">{customerData.name}</h4>
            <p className="text-sm text-foreground-secondary">{customerData.address}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button fullWidth size="lg" onClick={handleConfirm}>
          Pay Now
        </Button>
        <div className="text-center">
          <span className="text-foreground-secondary">OR</span>
        </div>
        <button
          onClick={() => setCurrentStep('delivery')}
          className="text-foreground-secondary hover:text-foreground flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} />
          Back to Address
        </button>
      </div>
    </div>
  );

  // Confirmation Step
  const ConfirmationStep = () => {
    const orderNumber = sessionStorage.getItem('lastOrderNumber') || 'SO000010';

    return (
      <CustomerDashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-red-500 mb-2">
                  Thank you for your order
                </h1>
                <p className="text-foreground-secondary">Order {orderNumber}</p>
              </div>
              <Button variant="outline">Print</Button>
            </div>

            <div className="bg-green-600 text-white p-4 rounded-lg mb-8">
              <p className="text-lg font-medium">Your Payment has been processed.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Delivery & Billing</h3>
                    </div>
                    <div className="border border-foreground-secondary/30 rounded p-4 mb-6">
                      <h4 className="font-semibold text-foreground mb-2">{customerData.name}</h4>
                      <p className="text-sm text-foreground-secondary">{customerData.address}</p>
                    </div>

                    <div className="text-center py-8">
                      <div className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
                        Vigorous Seahorse
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <OrderSummary />
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  clearCart();
                  router.push('/customer/orders');
                }}
              >
                View Orders
              </Button>
            </div>
          </div>
        </div>
      </CustomerDashboardLayout>
    );
  };

  if (currentStep === 'confirmation') {
    return <ConfirmationStep />;
  }

  return (
    <CustomerDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-foreground-secondary mb-6">
          Breadcrumbs {'>'} Order {'>'} Address {'>'} Payment
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Current Step Content */}
          <div className="lg:col-span-2">
            {currentStep === 'delivery' && <DeliveryStep />}
            {currentStep === 'payment' && <PaymentStep />}
          </div>

          {/* Right: Order Summary */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
