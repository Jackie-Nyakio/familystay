import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { bookingsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Booking {
  id: number;
  booking_reference: string;
  guest: { 
    name: string; 
    email: string;
    phone_number?: string;
  };
  listing: { 
    id: number;
    title: string;
    city: string;
    country: string;
    featured_image: string;
  };
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  nightly_price: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  created_at: string;
}

export default function HostBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsApi.getHostBookings();
      setBookings(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatus = async (id: number, status: string) => {
    try {
      await bookingsApi.updateBookingStatus(id, status);
      toast.success('Booking updated successfully!');
      fetchBookings();
      setSelectedBooking(null);
    } catch (error: any) {
      toast.error('Failed to update booking');
    }
  };

  const getFilteredBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (activeTab) {
      case 'pending':
        return bookings.filter(b => b.booking_status === 'PENDING');
      case 'confirmed':
        return bookings.filter(b => b.booking_status === 'CONFIRMED');
      case 'completed':
        return bookings.filter(b => b.booking_status === 'COMPLETED');
      case 'cancelled':
        return bookings.filter(b => b.booking_status === 'CANCELLED');
      case 'upcoming':
        return bookings.filter(b => b.booking_status === 'CONFIRMED' && b.check_in_date >= today);
      default:
        return bookings;
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/host/dashboard" className="text-gray-600 hover:text-primary-500">
              ← Back to Dashboard
            </Link>
            <Link href="/" className="text-2xl font-bold text-primary-500">
              FamilyStay
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="/host/dashboard" className="text-gray-600 hover:text-primary-500">
              Dashboard
            </Link>
            <button 
              onClick={() => { 
                localStorage.clear(); 
                router.push('/'); 
              }} 
              className="text-gray-600 hover:text-primary-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Host Bookings</h1>
        <p className="text-gray-600 mb-8">Manage your booking requests</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-500">{bookings.length}</div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.booking_status === 'PENDING').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.booking_status === 'CONFIRMED').length}
            </div>
            <div className="text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-500">
              KES {bookings.reduce((sum, b) => sum + Number(b.total_amount), 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-primary-500 text-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} ({tab === 'all' ? bookings.length : bookings.filter(b => b.booking_status === tab.toUpperCase()).length})
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="p-6">
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {booking.listing?.featured_image ? (
                            <img
                              src={booking.listing.featured_image}
                              alt={booking.listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                              🏠
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{booking.listing?.title || 'Property'}</h3>
                          <p className="text-gray-600 text-sm">{booking.listing?.city}, {booking.listing?.country}</p>
                          <p className="text-gray-500 text-xs mt-1">Ref: {booking.booking_reference}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:w-2/3">
                        <div>
                          <p className="text-xs text-gray-500">Guest</p>
                          <p className="font-medium text-sm truncate">{booking.guest?.name || 'Guest'}</p>
                          <p className="text-xs text-gray-600 truncate">{booking.guest?.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Check-in</p>
                          <p className="font-medium text-sm">{formatDate(booking.check_in_date)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Check-out</p>
                          <p className="font-medium text-sm">{formatDate(booking.check_out_date)}</p>
                        </div>
                        <div className="col-span-2 md:col-span-3 lg:col-span-1 lg:text-right">
                          <p className="font-bold text-primary-500">
                            KES {Number(booking.total_amount).toLocaleString()}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.booking_status)}`}>
                            {booking.booking_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                <p className="text-gray-600">There are no {activeTab !== 'all' ? activeTab : ''} bookings to display.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <p className="text-gray-500 text-sm">{selectedBooking.booking_reference}</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Property Info */}
                <div className="flex items-center gap-4 pb-6 border-b">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {selectedBooking.listing?.featured_image && (
                      <img
                        src={selectedBooking.listing.featured_image}
                        alt={selectedBooking.listing.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedBooking.listing?.title}</h3>
                    <p className="text-gray-600">{selectedBooking.listing?.city}, {selectedBooking.listing?.country}</p>
                  </div>
                </div>

                {/* Guest Info */}
                <div className="pb-6 border-b">
                  <h4 className="font-semibold mb-3">Guest Information</h4>
                  <p className="font-medium">{selectedBooking.guest?.name || 'Guest'}</p>
                  <p className="text-gray-600">{selectedBooking.guest?.email}</p>
                  {selectedBooking.guest?.phone_number && (
                    <p className="text-gray-600 mt-1">{selectedBooking.guest.phone_number}</p>
                  )}
                </div>

                {/* Stay Details */}
                <div className="pb-6 border-b">
                  <h4 className="font-semibold mb-3">Stay Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-medium">{formatDate(selectedBooking.check_in_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-medium">{formatDate(selectedBooking.check_out_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Number of Guests</p>
                      <p className="font-medium">{selectedBooking.number_of_guests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadge(selectedBooking.booking_status)}`}>
                        {selectedBooking.booking_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="pb-6 border-b">
                  <h4 className="font-semibold mb-3">Payment Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Nightly Rate</span>
                      <span>KES {Number(selectedBooking.nightly_price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary-500">KES {Number(selectedBooking.total_amount).toLocaleString()}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        selectedBooking.payment_status === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedBooking.payment_status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Using consistent button styling from other pages */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>

                  {selectedBooking.booking_status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleBookingStatus(selectedBooking.id, 'CONFIRMED')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept Booking
                      </button>
                      <button
                        onClick={() => handleBookingStatus(selectedBooking.id, 'CANCELLED')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Decline Booking
                      </button>
                    </>
                  )}

                  {selectedBooking.booking_status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleBookingStatus(selectedBooking.id, 'COMPLETED')}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}