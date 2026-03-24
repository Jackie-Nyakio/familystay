import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { bookingsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Booking {
  id: number;
  booking_reference: string;
  listing: {
    id: number;
    title: string;
    featured_image: string;
    city: string;
    country: string;
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

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

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
      const response = await bookingsApi.list();
      setBookings(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingsApi.cancel(bookingId, 'Cancelled by guest');
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      PENDING: 'badge-warning',
      CONFIRMED: 'badge-success',
      CANCELLED: 'badge-error',
      COMPLETED: 'badge-info',
      REFUNDED: 'badge-error',
    };
    return classes[status] || 'badge-info';
  };

  const getPaymentBadge = (status: string) => {
    const classes: Record<string, string> = {
      PENDING: 'badge-warning',
      PAID: 'badge-success',
      FAILED: 'badge-error',
    };
    return classes[status] || 'badge-info';
  };

  const today = new Date().toISOString().split('T')[0];

  const upcomingBookings = bookings.filter(b => 
    b.booking_status === 'CONFIRMED' && b.check_in_date >= today
  );
  
  const pendingBookings = bookings.filter(b => b.booking_status === 'PENDING');
  
  const pastBookings = bookings.filter(b => 
    b.booking_status === 'COMPLETED' || 
    (b.booking_status === 'CONFIRMED' && b.check_out_date < today)
  );
  
  const cancelledBookings = bookings.filter(b => 
    b.booking_status === 'CANCELLED' || b.booking_status === 'REFUNDED'
  );

  const getDisplayBookings = () => {
    switch (activeTab) {
      case 'upcoming': return upcomingBookings;
      case 'pending': return pendingBookings;
      case 'past': return pastBookings;
      case 'cancelled': return cancelledBookings;
      default: return bookings;
    }
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-500">FamilyStay</Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-gray-600">Dashboard</Link>
            <Link href="/search" className="text-gray-600">Explore</Link>
            <button onClick={() => { localStorage.clear(); router.push('/'); }} className="text-gray-600">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-4 px-4 text-center whitespace-nowrap ${activeTab === 'upcoming' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-4 px-4 text-center whitespace-nowrap ${activeTab === 'pending' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
            >
              Pending ({pendingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-4 px-4 text-center whitespace-nowrap ${activeTab === 'past' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
            >
              Past ({pastBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 py-4 px-4 text-center whitespace-nowrap ${activeTab === 'cancelled' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
            >
              Cancelled ({cancelledBookings.length})
            </button>
          </div>

          {getDisplayBookings().length > 0 ? (
            <div className="p-6 space-y-4">
              {getDisplayBookings().map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-40 md:h-auto bg-gray-200">
                      {booking.listing?.featured_image ? (
                        <img 
                          src={booking.listing.featured_image} 
                          alt={booking.listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`badge ${getStatusBadge(booking.booking_status)}`}>
                              {booking.booking_status}
                            </span>
                            <span className={`badge ${getPaymentBadge(booking.payment_status)}`}>
                              {booking.payment_status}
                            </span>
                          </div>
                          
                          <Link href={`/property/${booking.listing?.id}`} className="text-lg font-semibold hover:text-primary-500">
                            {booking.listing?.title || 'Property'}
                          </Link>
                          
                          <p className="text-gray-600 text-sm mt-1">
                            {booking.listing?.city}, {booking.listing?.country}
                          </p>
                          
                          <div className="mt-3 space-y-1 text-sm text-gray-600">
                            <p><strong>Check-in:</strong> {booking.check_in_date}</p>
                            <p><strong>Check-out:</strong> {booking.check_out_date}</p>
                            <p><strong>Guests:</strong> {booking.number_of_guests}</p>
                            <p><strong>Reference:</strong> {booking.booking_reference}</p>
                          </div>
                        </div>
                      
                        <div className="mt-4 md:mt-0 md:text-right">
                          <div className="text-2xl font-bold text-primary-500">
                            KES {Number(booking.total_amount).toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-500">
                            {booking.nightly_price} x {(new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) / (1000 * 60 * 60 * 24)} nights
                          </p>
                          
                          <div className="mt-4 flex gap-2">
                            <Link 
                              href={`/bookings/${booking.id}`}
                              className="btn-outline text-sm"
                            >
                              View Details
                            </Link>
                            {booking.booking_status === 'PENDING' && (
                              <button 
                                onClick={() => handleCancelBooking(booking.id)}
                                className="btn-outline text-red-500 border-red-500 hover:bg-red-50 text-sm"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming' && "You have no upcoming trips. Book your next adventure!"}
                {activeTab === 'pending' && "You have no pending bookings."}
                {activeTab === 'past' && "You haven't completed any stays yet."}
                {activeTab === 'cancelled' && "You have no cancelled bookings."}
              </p>
              <Link href="/search" className="btn-primary">
                Find a Place to Stay
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}