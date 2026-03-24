import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { bookingsApi, communicationsApi, propertiesApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface BookingDetail {
  id: number;
  booking_reference: string;
  property?: {  // Make property optional
    id: number;
    title: string;
    featured_image: string;
    address: string;
    city: string;
    host?: {
      id: number;
      name: string;
      profile_picture?: string;
    };
  };
  listing?: {  // Some APIs use 'listing' instead of 'property'
    id: number;
    title: string;
    featured_image: string;
    address: string;
    city: string;
    host?: {
      id: number;
      name: string;
      profile_picture?: string;
    };
  };
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  number_of_children: number;
  special_requests: string;
  nightly_price: number;
  total_nights: number;
  subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  guest_info?: {
    full_name: string;
    email: string;
    phone: string;
  };
  guest_name?: string;  // Some APIs use flat structure
  guest_email?: string;
  guest_phone?: string;
  created_at: string;
  history?: Array<{
    changed_by_name: string;
    changed_at: string;
    field_name: string;
    old_value: string;
    new_value: string;
    action: string;
  }>;
}

export default function BookingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
  setLoading(true);
  try {
    // Convert id to number
    const bookingId = Number(id);
    
    // Check which method exists on bookingsApi
    const response = await bookingsApi.get(bookingId);
    
    console.log('API Response:', response);
    console.log('Response data:', response.data);
    
    setBooking(response.data);
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    toast.error(error.response?.data?.message || 'Failed to load booking details');
    router.push('/bookings');
  } finally {
    setLoading(false);
  }
};

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingsApi.cancel(Number(id), 'Cancelled by guest');
      toast.success('Booking cancelled successfully');
      router.push('/bookings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <Link href="/bookings" className="text-primary-500 hover:underline">
            ← Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }
  const property =  booking.listing || booking.property ;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-500">FamilyStay</Link>
          <div className="flex gap-4">
            <Link href="/bookings" className="text-gray-600">My Bookings</Link>
            <Link href="/search" className="text-gray-600">Explore</Link>
            <button 
              onClick={() => {
                localStorage.clear();
                router.push('/auth/login');
              }} 
              className="text-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">Booking #{booking.booking_reference}</h1>
              <div className="flex gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.booking_status)}`}>
                  {booking.booking_status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentColor(booking.payment_status)}`}>
                  {booking.payment_status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-500">
                KES {Number(booking.total_amount).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                {booking.nightly_price} × {booking.total_nights} nights
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Info */}
            <div className="lg:col-span-2">
              <Link href={`/property/${property?.id}`} className="block group">
                <div className="relative rounded-lg overflow-hidden mb-4 shadow-sm">
                  <img 
                    src={booking.listing?.featured_image} 
                    alt={property?.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h2 className="text-2xl font-bold">{property?.title}</h2>
              </Link>
              <p className="text-gray-600 mt-1">{property?.address}, {property?.city}</p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Check-in</span>
                      <div className="font-semibold">{new Date(booking.check_in_date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Check-out</span>
                      <div className="font-semibold">{new Date(booking.check_out_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Guests</h3>
                  <div className="text-lg font-semibold">{booking.number_of_guests} guests</div>
                  {booking.number_of_children > 0 && (
                    <div className="text-sm text-gray-500">({booking.number_of_children} children)</div>
                  )}
                </div>

                {booking.special_requests && (
                  <div>
                    <h3 className="font-semibold mb-2">Special Requests</h3>
                    <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">{booking.special_requests}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nightly Rate</span>
                    <span>KES {Number(booking.nightly_price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>× {booking.total_nights} nights</span>
                    <span>KES {Number(booking.subtotal).toLocaleString()}</span>
                  </div>
                  {booking.cleaning_fee > 0 && (
                    <div className="flex justify-between">
                      <span>Cleaning Fee</span>
                      <span>KES {Number(booking.cleaning_fee).toLocaleString()}</span>
                    </div>
                  )}
                  {booking.service_fee > 0 && (
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>KES {Number(booking.service_fee).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 font-semibold text-lg">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>KES {Number(booking.total_amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {booking.booking_status === 'PENDING' && (
                  <button 
                    onClick={handleCancelBooking}
                    className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 font-semibold"
                  >
                    Cancel Booking
                  </button>
                )}
                <Link 
                  href={`/messages?propertyId=${property?.id}`}
                  className="w-full block bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 font-semibold text-center"
                >
                  Contact Host
                </Link>
                <Link 
                  href={`/property/${property?.id}`}
                  className="w-full block bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 font-semibold text-center"
                >
                  View Property
                </Link>
              </div>
            </div>
          </div>

          {/* Booking History */}
          {booking.history && booking.history.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Booking History</h3>
              <div className="space-y-3">
                {booking.history.map((change, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2 items-baseline">
                        <span className="font-semibold text-gray-900">{change.changed_by_name}</span>
                        <span className="text-sm text-gray-500">changed {change.field_name}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {change.old_value} → {change.new_value}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(change.changed_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Host Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h3 className="text-xl font-bold mb-4">Host</h3>
            <div className="flex items-center gap-4">
              <img 
                src={property?.host?.profile_picture || '/default-avatar.png'}
                alt={property?.host?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h4 className="font-semibold">{property?.host?.name}</h4>
                <Link 
                  href={`/messages?propertyId=${property?.id}`}
                  className="text-primary-500 hover:underline text-sm"
                >
                  Send Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}