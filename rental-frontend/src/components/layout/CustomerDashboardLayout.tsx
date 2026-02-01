// src/components/layout/CustomerDashboardLayout.tsx

'use client';

import React from 'react';
import CustomerSidebar from './CustomerSidebar';
import CustomerNavbar from './CustomerNavbar';

interface CustomerDashboardLayoutProps {
  children: React.ReactNode;
}

const CustomerDashboardLayout: React.FC<CustomerDashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />
      <div className="flex">
        <CustomerSidebar />
        <main className="flex-1 p-4 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;
