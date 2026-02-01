// src/components/layout/Navbar.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/auth/authStore';
import { useCartStore } from '@/store/cart/cartStore';
import Button from '@/components/ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = mounted ? getItemCount() : 0;

  // Check if we're on vendor or admin dashboard
  const isVendorOrAdminDashboard = pathname?.startsWith('/vendor/') || pathname?.startsWith('/admin/');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-background-secondary border-b border-foreground-secondary/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-foreground">RentalHub</span>
          </Link>

          {/* Desktop Navigation */}
          {!isVendorOrAdminDashboard && (
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-foreground-secondary hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart - Only show for non-vendor/admin pages */}
                {!isVendorOrAdminDashboard && (
                  <button
                    onClick={() => router.push('/customer/cart')}
                    className="relative p-2 text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Notifications */}
                {!isVendorOrAdminDashboard && (
                  <button
                    onClick={() => router.push('/notifications')}
                    className="p-2 text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    <Bell size={20} />
                  </button>
                )}

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-background-tertiary transition-colors">
                    <User size={20} className="text-foreground-secondary" />
                    <span className="text-sm font-medium text-foreground">
                      {user?.name}
                    </span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-background-secondary rounded-lg shadow-card border border-foreground-secondary/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/customer/profile"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-background-tertiary rounded-t-lg"
                    >
                      Profile
                    </Link>
                    <Link
                      href={
                        user?.role === 'vendor'
                          ? '/vendor/dashboard'
                          : user?.role === 'admin'
                          ? '/admin/dashboard'
                          : '/dashboard'
                      }
                      className="block px-4 py-2 text-sm text-foreground hover:bg-background-tertiary"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/customer/orders"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-background-tertiary"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-background-tertiary rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground-secondary hover:text-foreground"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-foreground-secondary/10">
            {!isVendorOrAdminDashboard && navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-sm text-foreground-secondary hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href="/customer/profile"
                  className="block py-2 text-sm text-foreground-secondary hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/customer/orders"
                  className="block py-2 text-sm text-foreground-secondary hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-sm text-error"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-4">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;