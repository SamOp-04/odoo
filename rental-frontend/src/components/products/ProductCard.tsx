// src/components/customer/products/ProductCard.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/models';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency, getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const lowestPrice = Math.min(
    product.rental_pricing.hourly || Infinity,
    product.rental_pricing.daily || Infinity,
    product.rental_pricing.weekly || Infinity
  );

  const isAvailable = product.quantity_on_hand > 0;

  return (
    <Link href={`/customer/products/${product._id}`}>
      <Card hover className="overflow-hidden">
        {/* Image */}
        <div className="relative h-48 bg-background-tertiary">
          {product.images && product.images.length > 0 ? (
            <Image
              src={getImageUrl(product.images[0])}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-foreground-muted">No Image</span>
            </div>
          )}

          {/* Availability Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={isAvailable ? 'success' : 'error'}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-lg mb-1 truncate">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-foreground-secondary mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Category */}
          {product.category && (
            <div className="mb-3">
              <Badge variant="default">{product.category}</Badge>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-secondary">Starting from</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(lowestPrice)}/day
              </p>
            </div>

            {/* Stock */}
            <div className="text-right">
              <p className="text-xs text-foreground-secondary">In Stock</p>
              <p className="text-sm font-medium text-foreground">
                {product.quantity_on_hand} units
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;