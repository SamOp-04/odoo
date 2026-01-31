'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutPage from '@/app/components/checkout-page';

export default function CheckoutRoute() {
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

  // Navigation function
  const navigateTo = (page: string, data?: any) => {
    switch (page) {
      case 'products':
      case 'product-listing':
        router.push('/product-listing-clean');
        break;
      case 'cart':
        router.push('/cart');
        break;
      case 'payment':
        router.push('/payment');
        break;
      case 'order-confirmation':
        router.push('/order-confirmation');
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
    <CheckoutPage
      cartItems={cartItems}
      navigateTo={navigateTo}
      currentUser={currentUser}
    />
  );
}
