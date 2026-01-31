// src/app/(customer)/products/[id]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DatePicker from '@/components/ui/DatePicker';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/store/cart/cartStore';
import { Product, RentalDurationType, CartItem } from '@/types/models';
import { formatCurrency, getImageUrl, calculateDuration } from '@/lib/utils';
import { ShoppingCart, Calendar, Shield, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [durationType, setDurationType] = useState<RentalDurationType>('daily');
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsApi.getById(params.id as string);
        setProduct(data);
      } catch (error: any) {
        toast.error('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const calculatePrice = () => {
    if (!product || !startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = calculateDuration(start, end, durationType);
    
    let unitPrice = 0;
    switch (durationType) {
      case 'hourly':
        unitPrice = product.rental_pricing.hourly || 0;
        break;
      case 'daily':
        unitPrice = product.rental_pricing.daily || 0;
        break;
      case 'weekly':
        unitPrice = product.rental_pricing.weekly || 0;
        break;
      case 'custom':
        unitPrice = product.rental_pricing.custom?.price || 0;
        break;
    }
    
    return unitPrice * duration * quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!startDate || !endDate) {
      toast.error('Please select rental dates');
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      toast.error('End date must be after start date');
      return;
    }
    
    const variant = selectedVariant 
      ? product.variants?.find(v => v._id === selectedVariant)
      : undefined;
    
    const duration = calculateDuration(start, end, durationType);
    let unitPrice = 0;
    
    switch (durationType) {
      case 'hourly':
        unitPrice = product.rental_pricing.hourly || 0;
        break;
      case 'daily':
        unitPrice = product.rental_pricing.daily || 0;
        break;
      case 'weekly':
        unitPrice = product.rental_pricing.weekly || 0;
        break;
      case 'custom':
        unitPrice = product.rental_pricing.custom?.price || 0;
        break;
    }
    
    const cartItem: CartItem = {
      product,
      variant,
      quantity,
      startDate: start,
      endDate: end,
      durationType,
      pricing: {
        unitPrice,
        subtotal: unitPrice * duration * quantity,
        deposit: product.security_deposit * quantity,
        duration,
      },
    };
    
    addItem(cartItem);
    toast.success('Added to cart!');
    router.push('/customer/cart');
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Button onClick={() => router.push('/customer/products')}>Browse Products</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = calculatePrice();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square bg-background-secondary rounded-lg overflow-hidden mb-4">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={getImageUrl(product.images[selectedImage])}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package size={64} className="text-foreground-muted" />
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              {product.category && (
                <Badge variant="default">{product.category}</Badge>
              )}
            </div>

            {product.description && (
              <p className="text-foreground-secondary mb-6">
                {product.description}
              </p>
            )}

            {/* Pricing */}
            <div className="bg-background-secondary rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Rental Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.rental_pricing.hourly && (
                  <div>
                    <p className="text-sm text-foreground-secondary">Hourly</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(product.rental_pricing.hourly)}/hr
                    </p>
                  </div>
                )}
                {product.rental_pricing.daily && (
                  <div>
                    <p className="text-sm text-foreground-secondary">Daily</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(product.rental_pricing.daily)}/day
                    </p>
                  </div>
                )}
                {product.rental_pricing.weekly && (
                  <div>
                    <p className="text-sm text-foreground-secondary">Weekly</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(product.rental_pricing.weekly)}/week
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-foreground-secondary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-secondary">Security Deposit</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(product.security_deposit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Variant
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant._id || null)}
                      className={`p-3 rounded-lg border-2 text-left ${
                        selectedVariant === variant._id
                          ? 'border-primary bg-primary/10'
                          : 'border-foreground-secondary/20'
                      }`}
                    >
                      <p className="font-medium text-foreground">{variant.name}</p>
                      <p className="text-sm text-foreground-secondary">
                        {variant.quantity} available
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rental Configuration */}
            <div className="space-y-4 mb-6">
              <Select
                label="Rental Duration Type"
                options={[
                  { value: 'hourly', label: 'Hourly' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                ]}
                value={durationType}
                onChange={(e) => setDurationType(e.target.value as RentalDurationType)}
              />

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />

                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity_on_hand}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-background-secondary border border-foreground-secondary/20 rounded-lg text-foreground"
                />
                <p className="text-sm text-foreground-secondary mt-1">
                  {product.quantity_on_hand} available
                </p>
              </div>
            </div>

            {/* Total Price */}
            {totalPrice > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground-secondary">Rental Cost</span>
                  <span className="text-lg font-bold text-foreground">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-secondary">Deposit (refundable)</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(product.security_deposit * quantity)}
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <Button
              fullWidth
              size="lg"
              onClick={handleAddToCart}
              disabled={product.quantity_on_hand === 0}
            >
              <ShoppingCart size={20} className="mr-2" />
              {product.quantity_on_hand === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {/* Features */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="text-primary" size={20} />
                <span className="text-foreground-secondary">Secure and verified products</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-primary" size={20} />
                <span className="text-foreground-secondary">Flexible rental periods</span>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="text-primary" size={20} />
                <span className="text-foreground-secondary">Quality guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}