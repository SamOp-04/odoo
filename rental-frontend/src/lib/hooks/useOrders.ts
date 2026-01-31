// src/lib/hooks/useOrders.ts

import { useState, useEffect } from 'react';
import { ordersApi } from '@/lib/api/orders';
import { RentalOrder } from '@/types/models';

export function useOrders() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ordersApi.getAll();
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, isLoading, error, refetch: fetchOrders };
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await ordersApi.getById(id);
      setOrder(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return { order, isLoading, error, refetch: fetchOrder };
}