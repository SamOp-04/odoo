'use client';

import React, { useState } from 'react';

const AuthenticatedHeader = ({ userRole = 'Admin', userName = 'Admin User' }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Simulate logout process
    setTimeout(() => {
      // Clear session/localStorage/cookies here
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login
      window.location.href = '/login';
    }, 1500);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUserRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-600';
      case 'vendor':
        return 'bg-blue-600';
      case 'customer':
        return 'bg-green-600';
      default:
        return 'bg-purple-600';
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-600 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-xl font-semibold">Your Logo</div>
          <nav className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Orders</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Reports</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Settings</a>
          </nav>
        </div>
        
        {/* User Profile Section */}
        <div className="flex items-center space-x-4 relative">
          <span className="text-gray-300">{userName}</span>
          
          {/* Profile Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`w-8 h-8 ${getUserRoleColor(userRole)} rounded-full flex items-center justify-center text-sm font-semibold text-white hover:opacity-80 transition-opacity`}
            >
              {getInitials(userName)}
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-600">
                  <div className="text-white font-medium">{userName}</div>
                  <div className="text-gray-400 text-sm">{userRole}</div>
                </div>
                
                <div className="py-2">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                  >
                    Profile Settings
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                  >
                    Account Settings
                  </a>
                  <div className="border-t border-gray-600 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-600 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Logging out...</span>
                        </div>
                      ) : (
                        'Logout'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Overlay (when logging out) */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 text-center">
            <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Logging out...</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default AuthenticatedHeader;