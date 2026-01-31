'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartPage from '@/app/components/cart-page-new';

export default function CartRoute() {
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
    if (typeof window !== 'undefined') {
      if (cartItems.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } else {
        localStorage.removeItem('cart');
      }
    }
  }, [cartItems]);

  // Update cart item
  const updateCartItem = (id: string, updates: Partial<any>) => {
    setCartItems(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      return updated;
    });
  };

  // Remove from cart
  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Create order
  const createOrder = (orderData: any) => {
    // Mock order creation
    const order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    return order;
  };

  // Navigation function
  const navigateTo = (page: string, data?: any) => {
    switch (page) {
      case 'products':
      case 'product-listing':
        router.push('/product-listing-clean');
        break;
      case 'product-detail':
        if (data?.productId) {
          router.push(`/product-detail/${data.productId}`);
        }
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
    <CartPage
      cartItems={cartItems}
      updateCartItem={updateCartItem}
      removeFromCart={removeFromCart}
      navigateTo={navigateTo}
      createOrder={createOrder}
      currentUser={currentUser}
    />
  );
}
