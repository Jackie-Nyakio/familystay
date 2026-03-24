import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { bookingsApi } from '@/lib/api';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone_number?: string;
  profile_picture?: string;
}

interface Booking {
  id: number;
  booking_reference: string;
  listing?: {
    id: number;
    title: string;
    featured_image: string;
    city: string;
    country: string;
  };
  property?: {
    id: number;
    title: string;
    featured_image: string;
    city: string;
    country: string;
  };
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Fetch recent bookings if user is a guest
        if (parsedUser.role === 'GUEST' || !parsedUser.role) {
          fetchRecentBookings();
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        // Fallback to demo user
        setUser({
          id: 1,
          username: 'demo_user',
          first_name: 'Demo',
          last_name: 'User',
          email: 'demo@familystay.co.ke',
          role: 'GUEST',
        });
      }
    } else {
      // Demo user for testing
      setUser({
        id: 1,
        username: 'demo_user',
        first_name: 'Demo',
        last_name: 'User',
        email: 'demo@familystay.co.ke',
        role: 'GUEST',
      });
      fetchRecentBookings();
    }
    setLoading(false);
  }, [router]);

  const fetchRecentBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await bookingsApi.list();
      // Get the bookings array from response
      const bookings = response.data.results || response.data || [];
      // Sort by check-in date and get recent ones
      const sorted = Array.isArray(bookings) 
        ? [...bookings].sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime())
        : [];
      setRecentBookings(sorted.slice(0, 3));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setRecentBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const isGuest = user?.role === 'GUEST' || !user?.role;
  const isHost = user?.role === 'HOST';

  // Helper to get property title
  const getPropertyTitle = (booking: Booking) => {
    return booking.listing?.title || booking.property?.title || 'Property';
  };

  // Helper to get property location
  const getPropertyLocation = (booking: Booking) => {
    const city = booking.listing?.city || booking.property?.city || 'Location';
    const country = booking.listing?.country || booking.property?.country || 'Kenya';
    return `${city}, ${country}`;
  };

  // Helper to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-500">
              FamilyStay
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/search" className="text-gray-600 hover:text-primary-500">
                Explore
              </Link>
              {isHost && (
                <Link href="/host/dashboard" className="text-gray-600 hover:text-primary-500">
                  Host Dashboard
                </Link>
              )}
              <Link href="/change-password" className="text-gray-600 hover:text-primary-500">
                Change Password
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-500">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                    {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                  </div>
                  <span>{user?.first_name || user?.username || 'User'}</span>
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-primary-500"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || user?.username || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isHost 
              ? "Manage your properties and bookings from your host dashboard"
              : "Find your next family getaway or manage your bookings"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Search Properties - For Guests */}
          {isGuest && (
            <Link href="/search">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold text-lg mb-1">Find a Stay</h3>
                <p className="text-gray-600 text-sm">Search for family-friendly properties</p>
              </div>
            </Link>
          )}

          {/* My Bookings - For Guests */}
          {isGuest && (
            <Link href="/bookings">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-semibold text-lg mb-1">My Bookings</h3>
                <p className="text-gray-600 text-sm">View your upcoming and past stays</p>
              </div>
            </Link>
          )}

          {/* Become a Host - For Guests */}
          {isGuest && (
            <Link href="/host/become-host">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="font-semibold text-lg mb-1">Become a Host</h3>
                <p className="text-gray-600 text-sm">Earn money by hosting properties</p>
              </div>
            </Link>
          )}

          {/* Host Dashboard - For Hosts */}
          {isHost && (
            <Link href="/host/dashboard">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="font-semibold text-lg mb-1">My Properties</h3>
                <p className="text-gray-600 text-sm">Manage your listings</p>
              </div>
            </Link>
          )}

          {/* Host Bookings - For Hosts */}
          {isHost && (
            <Link href="/host/bookings">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="font-semibold text-lg mb-1">Booking Requests</h3>
                <p className="text-gray-600 text-sm">View incoming bookings</p>
              </div>
            </Link>
          )}

          {/* Messages */}
          <Link href="/messages">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-semibold text-lg mb-1">Messages</h3>
              <p className="text-gray-600 text-sm">Chat with hosts and guests</p>
            </div>
          </Link>

          {/* Profile */}
          <Link href="/profile">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="font-semibold text-lg mb-1">My Profile</h3>
              <p className="text-gray-600 text-sm">Update your account settings</p>
            </div>
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity / Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">
                {isHost ? 'Recent Booking Activity' : 'Recent Bookings'}
              </h2>
              
              {loadingBookings ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isGuest ? (
                    // Real guest bookings from API
                    <>
                      {recentBookings.length > 0 ? (
                        recentBookings.slice(0, 3).map(booking => (
                          <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{getPropertyTitle(booking)}</h3>
                                <p className="text-sm text-gray-600">{getPropertyLocation(booking)}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                  {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">KES {Number(booking.total_amount).toLocaleString()}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.booking_status)}`}>
                                {booking.booking_status}
                              </span>
                            </div>
                            <div className="mt-3">
                              <Link 
                                href={`/bookings/${booking.id}`}
                                className="text-sm text-primary-500 hover:text-primary-600"
                              >
                                View Details →
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">📅</div>
                          <p>No upcoming bookings</p>
                          <p className="text-sm">Book your first family stay!</p>
                        </div>
                      )}
                    </>
                  ) : (
                    // Host view - sample property bookings
                    <>
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">Modern Apartment - Booking #FAM-2024-00012</h3>
                            <p className="text-sm text-gray-600">Guest: John Smith</p>
                            <p className="text-sm text-gray-500 mt-2">Dec 20 - Dec 25, 2024 • KES 75,000</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">Luxury Villa - Booking #FAM-2024-00011</h3>
                            <p className="text-sm text-gray-600">Guest: Sarah Johnson</p>
                            <p className="text-sm text-gray-500 mt-2">Dec 15 - Dec 18, 2024 • KES 45,000</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            New Request
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <Link 
                href={isHost ? "/host/bookings" : "/bookings"}
                className="block mt-4 text-center text-primary-500 hover:text-primary-600 font-medium"
              >
                View all bookings →
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Account</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900 break-all text-sm">{user?.email || 'demo@familystay.co.ke'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className="text-gray-900 capitalize">{user?.role || 'Guest'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="text-gray-900">2024</span>
                </div>
              </div>
              <Link 
                href="/profile"
                className="block mt-4 text-center btn-outline"
              >
                Edit Profile
              </Link>
              <Link 
                href="/change-password"
                className="block mt-2 text-center text-sm text-primary-500 hover:text-primary-600"
              >
                Change Password →
              </Link>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <p className="text-gray-600 text-sm mb-4">
                Have questions? Our support team is available 24/7.
              </p>
              <Link 
                href="/help"
                className="block text-center text-primary-500 hover:text-primary-600 font-medium"
              >
                Visit Help Center →
              </Link>
            </div>

            {/* Switch to Host (for guests) */}
            {isGuest && (
              <div className="bg-primary-50 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 text-primary-700">Want to Earn?</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Join our host community and start earning from your property today.
                </p>
                <Link 
                  href="/host/become-host"
                  className="block text-center btn-primary"
                >
                  Become a Host
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}