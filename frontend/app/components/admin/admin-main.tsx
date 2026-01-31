'use client';

import React, { useState } from 'react';
import AdminSidebar from './admin-sidebar';
import AdminDashboardHome from './admin-dashboard-home';
import AdminRentalPeriods from './admin-rental-periods';
import AdminAttributes from './admin-attributes';
import AdminUsers from './admin-users';
import AdminReports from './admin-reports';
import AdminCustomerProducts from './admin-customer-products';
import AdminVendorProducts from './admin-vendor-products';
import AdminOrders from './admin-orders';
import AdminProfile from './admin-profile';

type AdminPage = 
  | 'dashboard' 
  | 'rental-periods' 
  | 'attributes' 
  | 'users' 
  | 'profile'
  | 'reports'
  | 'customer-products'
  | 'vendor-products'
  | 'all-orders';

interface AdminMainProps {
  currentUser?: any;
  onLogout: () => void;
}

const AdminMain = ({ currentUser, onLogout }: AdminMainProps) => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');

  const navigateTo = (page: AdminPage) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboardHome />;
      case 'rental-periods':
        return <AdminRentalPeriods />;
      case 'attributes':
        return <AdminAttributes />;
      case 'users':
        return <AdminUsers />;
      case 'profile':
        return <AdminProfile />;
      case 'reports':
        return <AdminReports />;
      case 'customer-products':
        return <AdminCustomerProducts />;
      case 'vendor-products':
        return <AdminVendorProducts />;
      case 'all-orders':
        return <AdminOrders />;
      default:
        return <AdminDashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} currentUser={currentUser} onLogout={onLogout} />
      <div className="flex-1 overflow-auto">
        <header className="bg-gray-800 border-b border-gray-700 px-8 py-4 sticky top-0 z-40 flex items-center justify-between">
          <div className="text-2xl font-bold text-pink-600">Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">Welcome, {currentUser?.name || 'Admin'}</div>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default AdminMain;
