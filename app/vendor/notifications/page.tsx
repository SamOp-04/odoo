'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/vendor/PageHeader';
import { mockNotifications } from '@/lib/mock-data/vendor';
import type { Notification } from '@/lib/types/vendor';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <InfoIcon className="w-6 h-6 text-blue-500" />;
      case 'warning':
        return <WarningIcon className="w-6 h-6 text-orange-500" />;
      case 'error':
        return <ErrorIcon className="w-6 h-6 text-red-500" />;
      case 'success':
        return <SuccessIcon className="w-6 h-6 text-green-500" />;
      default:
        return <InfoIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div>
      <PageHeader title="Notifications" />

      {/* Filter Tabs */}
      <div className="bg-black border border-white rounded-lg p-2 mb-6 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition-colors font-medium ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-2 rounded-full transition-colors font-medium ${
              filter === 'unread'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-black border rounded-lg p-6 transition-colors ${
                notification.read ? 'border-gray-800' : 'border-white'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="ml-2 w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{notification.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                    
                    <div className="flex items-center space-x-3">
                      {notification.actionLink && (
                        <Link
                          href={notification.actionLink}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-400 hover:text-white text-sm"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-black border border-white rounded-lg p-12 text-center">
            <BellIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No notifications</p>
            <p className="text-gray-500 text-sm">
              {filter === 'unread' ? "You're all caught up!" : 'Notifications will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Icon Components
function InfoIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WarningIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function ErrorIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SuccessIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BellIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
