'use client';

import React from 'react';

interface AdminSidebarProps {
  currentPage: string;
  navigateTo: (page: any) => void;
  currentUser?: any;
  onLogout: () => void;
}

const AdminSidebar = ({ currentPage, navigateTo, currentUser, onLogout }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'separator1', label: 'Modules', isHeader: true },
    { id: 'all-orders', label: 'All Orders', icon: '📦' },
    { id: 'customer-products', label: 'Customer Products', icon: '🛍️' },
    { id: 'vendor-products', label: 'Vendor Products', icon: '🏪' },
    { id: 'separator2', label: 'Settings', isHeader: true },
    { id: 'rental-periods', label: 'Rental Periods', icon: '⏱️' },
    { id: 'attributes', label: 'Attributes', icon: '🏷️' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'separator3', label: 'Other', isHeader: true },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'profile', label: 'Profile', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-pink-600">Odoo Admin</h1>
        <p className="text-xs text-gray-500 mt-1">Management System</p>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          if (item.isHeader) {
            return (
              <div key={item.id} className="px-4 py-3 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {item.label}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === item.id
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700 bg-gray-900">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800">
          <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentUser?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
