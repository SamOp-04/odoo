'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from './auth-login';
import AdminMain from './admin/admin-main';

// Lazy load the customer rental system
const RentalManagementSystem = React.lazy(() => import('./rental-management-system'));

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
}

const MainApp = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  const handleLogin = (user: User) => {
    // Redirect vendors to the new vendor portal immediately
    if (user.role === 'vendor') {
      router.push('/vendor/dashboard');
      return;
    }
    
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Show login if no user is authenticated
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Route based on user role
  switch (currentUser.role) {
    case 'customer':
      return (
        <Suspense 
          fallback={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-gray-300">Loading...</div>
              </div>
            </div>
          }
        >
          <RentalManagementSystem currentUser={currentUser} onLogout={handleLogout} />
        </Suspense>
      );
      
    case 'admin':
      return <AdminMain currentUser={currentUser} onLogout={handleLogout} />;
      
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
};

export default MainApp;