'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductListingPage from '@/app/components/product-listing-clean';

export default function ProductListingRoute() {
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Add to cart function
  const addToCart = (product: any, quantity?: number, rentalPeriod?: string, startDate?: string, endDate?: string) => {
    const cartItem = {
      ...product,
      cartQuantity: quantity || 1,
      rentalPeriod: rentalPeriod || '24 hours',
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date(Date.now() + 86400000).toISOString(),
      addedAt: Date.now()
    };

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          cartQuantity: (updated[existingIndex].cartQuantity || 1) + (quantity || 1)
        };
        return updated;
      }
      return [...prev, cartItem];
    });

    // Show success message
    alert('Product added to cart!');
  };

  // Navigation function
  const navigateTo = (page: 'products' | 'product-detail' | 'cart', data?: any) => {
    switch (page) {
      case 'products':
        router.push('/product-listing-clean');
        break;
      case 'product-detail':
        if (data?.productId) {
          router.push(`/product-detail/${data.productId}`);
        }
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
    <ProductListingPage
      cartItems={cartItems}
      addToCart={addToCart}
      navigateTo={navigateTo}
      currentUser={currentUser}
      onLogout={onLogout}
    />
  );
}
