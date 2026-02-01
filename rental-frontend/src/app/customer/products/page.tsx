// src/app/(customer)/products/page.tsx

'use client';

import React, { useState } from 'react';
import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';
import ProductCard from '@/components/products/ProductCard';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import { useProducts } from '@/lib/hooks/useProducts';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { products, isLoading, error } = useProducts({ 
    is_published: true,
    category: category || undefined,
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    product.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  return (
    <CustomerDashboardLayout>
        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-error">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground-secondary">
              No products found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </CustomerDashboardLayout>
  );
}