// src/components/layout/CustomerNavbar.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingCart, User, Menu, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/auth/authStore';
import { useCartStore } from '@/store/cart/cartStore';

const CustomerNavbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = React.useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = mounted ? getItemCount() : 0;

  React.useEffect(() => {
    setMounted(true);
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const unreadCount = data.filter((n: any) => !n.is_read).length;
        setNotificationCount(unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notification count:', err);
    }
  };

  const navigation = [
    { name: 'Products', href: '/customer/products' },
    { name: 'Terms & Condition', href: '/terms' },
    { name: 'About us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav className="bg-background-secondary border-b border-foreground-secondary/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/customer/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-lg font-bold text-foreground hidden sm:inline">Your Logo</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-48 lg:w-64 pl-4 pr-10 py-2 bg-background border border-foreground-secondary/20 rounded-lg text-sm text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-foreground-secondary hover:text-foreground"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Search Icon (Mobile) */}
            <button className="md:hidden p-2 text-foreground-secondary hover:text-foreground">
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              href="/customer/wishlist"
              className="p-2 text-foreground-secondary hover:text-foreground transition-colors"
              title="Wishlist"
            >
              <Heart size={20} />
            </Link>

            {/* Notifications */}
            <Link
              href="/customer/notifications"
              className="relative p-2 text-foreground-secondary hover:text-foreground transition-colors"
              title="Notifications"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>

            {/* Cart with Badge */}
            <Link
              href="/customer/cart"
              className="relative p-2 text-foreground-secondary hover:text-foreground transition-colors"
              title="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="p-2 text-foreground-secondary hover:text-foreground transition-colors">
                <User size={20} />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-background-secondary rounded-lg shadow-lg border border-foreground-secondary/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-3 border-b border-foreground-secondary/10">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-foreground-secondary">{user?.email}</p>
                </div>
                <Link
                  href="/customer/profile"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-background-tertiary"
                >
                  My Profile
                </Link>
                <Link
                  href="/customer/orders"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-background-tertiary"
                >
                  My Orders
                </Link>
                <Link
                  href="/customer/notifications"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-background-tertiary"
                >
                  Notifications
                  {notificationCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/customer/dashboard"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-background-tertiary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-background-tertiary rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
