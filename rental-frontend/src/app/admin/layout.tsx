'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Building2, Package, ShoppingBag, BarChart3, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [mounted, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!mounted || !user || user.role !== 'admin') {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Vendors', href: '/admin/users', icon: Building2 },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-800 z-50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">24×7 Rentals – Admin</h1>
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
              Production
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed top-16 left-0 bottom-0 w-64 bg-black border-r border-gray-800 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mt-16 p-8 min-h-[calc(100vh-4rem)]">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
