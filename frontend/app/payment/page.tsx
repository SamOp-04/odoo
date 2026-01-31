'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentPage from '@/app/components/payment-page-fixed';

export default function PaymentRoute() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Error loading cart:', e);
        }
      }

      // Load user from localStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error loading user:', e);
        }
      }
    }
  }, []);

  // Create order
  const createOrder = (orderData: any) => {
    // Mock order creation
    const order = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return order;
  };

  // Navigation function
  const navigateTo = (page: string, data?: any) => {
    switch (page) {
      case 'order-confirmation':
        // Save order to localStorage before navigating
        if (data && typeof window !== 'undefined') {
          localStorage.setItem('lastOrder', JSON.stringify(data));
        }
        // Clear cart on successful payment
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart');
        }
        router.push('/order-confirmation');
        break;
      case 'checkout':
        router.push('/checkout');
        break;
      case 'cart':
        router.push('/cart');
        break;
      default:
        router.push('/product-listing-clean');
    }
  };

  // Logout function
  const onLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
      }
      router.push('/login');
    }
  };

  return (
    <PaymentPage
      cartItems={cartItems}
      navigateTo={navigateTo}
      createOrder={createOrder}
      currentUser={currentUser}
    />
  );
}
