'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductDetail from '@/app/components/product-detail';

// Product data (shared with product listing)
const products = [
  {
    id: 1,
    name: "Professional Camera",
    category: "Photography",
    price: 150,
    duration: "per day",
    image: "/api/placeholder/300/200",
    brand: "Canon",
    color: "Black",
    description: "High-end DSLR camera perfect for professional photography with advanced features and excellent image quality. Suitable for both beginners and professionals.",
    available: true,
    pricePerHour: 25,
    pricePerDay: 150,
    pricePerNight: 120,
    pricePerWeek: 900
  },
  {
    id: 2,
    name: "Drone with 4K Camera",
    category: "Technology",
    price: 200,
    duration: "per day",
    image: "/api/placeholder/300/200",
    brand: "DJI",
    color: "White",
    description: "Advanced drone with 4K video recording capabilities and intelligent flight modes. Perfect for aerial photography and videography.",
    available: true,
    pricePerHour: 35,
    pricePerDay: 200,
    pricePerNight: 160,
    pricePerWeek: 1200
  },
  {
    id: 3,
    name: "Wireless Microphone",
    category: "Audio",
    price: 50,
    duration: "per day",
    image: "/api/placeholder/300/200",
    brand: "Shure",
    color: "Black",
    description: "Professional wireless microphone system with crystal clear audio quality. Ideal for interviews, presentations, and recording.",
    available: true,
    pricePerHour: 10,
    pricePerDay: 50,
    pricePerNight: 40,
    pricePerWeek: 300
  },
  {
    id: 4,
    name: "LED Lighting Kit",
    category: "Lighting",
    price: 80,
    duration: "per day",
    image: "/api/placeholder/300/200",
    brand: "Neewer",
    color: "Silver",
    description: "Complete LED lighting setup for video production",
    available: true
  },
  {
    id: 5,
    name: "Gaming Laptop",
    category: "Electronics",
    price: 120,
    duration: "per day",
    image: "/api/placeholder/300/200",
    brand: "ASUS",
    color: "Black",
    description: "High-performance gaming laptop",
    available: true
  },
  {
    id: 6,
    name: "Sound System",
    category: "Audio",
    price: 300,
    duration: "per day",
    image: "/api/placeholder/300/200",
    brand: "JBL",
    color: "Black",
    description: "Professional sound system for events",
    available: true
  },
  {
    id: 7,
    name: "Video Camera",
    category: "Photography",
    price: 180,
    duration: "per day",
    image: "/api/placeholder/300/200",
    brand: "Sony",
    color: "Black",
    description: "Professional video camera for filming",
    available: true
  },
  {
    id: 8,
    name: "Projector",
    category: "Electronics",
    price: 100,
    duration: "per day",
    image: "/api/placeholder/300/200",
    brand: "Epson",
    color: "White",
    description: "HD projector for presentations and entertainment",
    available: true
  }
];

export default function ProductDetailRoute() {
  const router = useRouter();
  const params = useParams();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Get the product by ID
  const productId = params?.id ? Number(params.id) : 1;
  const product = products.find(p => p.id === productId) || products[0];

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

    alert('Product added to cart!');
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
    <ProductDetail
      product={product}
      cartItems={cartItems}
      addToCart={addToCart}
      navigateTo={navigateTo}
      currentUser={currentUser}
    />
  );
}
