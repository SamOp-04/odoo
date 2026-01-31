// src/app/(customer)/products/page.tsx

'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Browse Products
          </h1>
          <p className="text-foreground-secondary">
            Find the perfect equipment for your needs
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" 
              size={20} 
            />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map((cat) => ({ value: cat!, label: cat! })),
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

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
      </main>

      <Footer />
    </div>
  );
}