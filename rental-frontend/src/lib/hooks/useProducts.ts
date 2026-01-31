// src/lib/hooks/useProducts.ts

import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/api/products';
import { Product } from '@/types/models';

export function useProducts(filters?: { category?: string; is_published?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productsApi.getAll(filters);
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters?.category, filters?.is_published]);

  return { products, isLoading, error, refetch: () => {} };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productsApi.getById(id);
        setProduct(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, isLoading, error };
}