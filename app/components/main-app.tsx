'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MainApp = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page on mount
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-gray-300">Redirecting...</div>
      </div>
    </div>
  );
};

export default MainApp;