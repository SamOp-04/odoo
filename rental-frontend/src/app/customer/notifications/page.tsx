'use client';

import { useEffect, useState } from 'react';
import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';
import { Bell, Check, Package, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Notification {
  _id: string;
  type: 'pickup_reminder' | 'return_due' | 'late_return' | 'payment_success' | 'order_confirmed';
  title: string;
  message: string;
  is_read: boolean;
  related_order?: {
    _id: string;
    order_number: string;
  };
  createdAt: string;
}

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await res.json();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNotifications(
          notifications.map((n) =>
            n._id === notificationId ? { ...n, is_read: true } : n
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.is_read);
    
    for (const notification of unreadNotifications) {
      await markAsRead(notification._id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_confirmed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'payment_success':
        return <CreditCard className="h-6 w-6 text-blue-500" />;
      case 'pickup_reminder':
        return <Package className="h-6 w-6 text-orange-500" />;
      case 'return_due':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'late_return':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    const opacity = isRead ? 'bg-gray-800' : 'bg-gray-700';
    
    switch (type) {
      case 'order_confirmed':
        return `${opacity} border-green-600/30`;
      case 'payment_success':
        return `${opacity} border-blue-600/30`;
      case 'pickup_reminder':
        return `${opacity} border-orange-600/30`;
      case 'return_due':
        return `${opacity} border-yellow-600/30`;
      case 'late_return':
        return `${opacity} border-red-600/30`;
      default:
        return `${opacity} border-gray-600/30`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading notifications...</p>
          </div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (error) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400 mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setFilter('all')}
            className={`pb-3 px-1 font-medium transition-colors border-b-2 ${
              filter === 'all'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`pb-3 px-1 font-medium transition-colors border-b-2 ${
              filter === 'unread'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-700">
              <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${getNotificationBgColor(
                  notification.type,
                  notification.is_read
                )} ${
                  !notification.is_read ? 'hover:bg-gray-700' : 'hover:bg-gray-750'
                }`}
                onClick={() => !notification.is_read && markAsRead(notification._id)}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg">
                          {notification.title}
                        </h3>
                        <p className="text-gray-300 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        {notification.related_order && (
                          <p className="text-sm text-gray-400 mt-2">
                            Order: {notification.related_order.order_number}
                          </p>
                        )}
                      </div>

                      {/* Unread Badge */}
                      {!notification.is_read && (
                        <span className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></span>
                      )}
                    </div>

                    {/* Timestamp */}
                    <p className="text-sm text-gray-500 mt-3">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
