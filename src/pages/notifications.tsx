import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { communicationsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      fetchNotifications();
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = selectedTab === 'unread' ? { is_read: false } : {};
      const response = await communicationsApi.listNotifications(params);
      const data = response.data.results || response.data || [];
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await communicationsApi.markNotificationRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await communicationsApi.markAllNotificationsRead();
      setNotifications(prev => 
        prev.map(notif => 
          !notif.is_read 
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-500" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'error': return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex-1">Notifications</h1>
            <div className="relative">
              <FaBell className="text-2xl text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setSelectedTab('unread')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'unread'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </nav>
          </div>

          {unreadCount > 0 && (
            <div className="p-6 bg-blue-50 border-b">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaBell className="mx-auto text-6xl text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                You'll see important updates here when they happen
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 ${
                  notification.is_read
                    ? 'border-gray-200'
                    : 'border-primary-500 bg-primary-50 shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-1">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-2 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(notification.created_at)}</span>
                      {notification.is_read && (
                        <span>✓ Read</span>
                      )}
                    </div>
                  </div>
                  
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

