import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { paymentsApi, bookingsApi, propertiesApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Booking {
  id: number;
  booking_reference: string;
  listing?: Property;
  property?: Property;
  total_amount: number;
  payment_status: string;
  booking_status: string;
}

interface Property {
  id: number;
  title: string;
  featured_image: string;
  city: string;
  host?: { name: string; profile_picture?: string };
  security_deposit: number;
}

export default function SecurityDepositPayment() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [booking, setBooking] = useState<Booking | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const bookingData = await bookingsApi.get(Number(id));
      setBooking(bookingData.data);
      
      const prop = bookingData.data.listing || bookingData.data.property;
      if (prop) {
        // Fetch full property to get security_deposit
        const propertyData = await propertiesApi.get(prop.id);
        setProperty(propertyData.data);
      }
    } catch (error) {
      toast.error('Failed to load booking details');
      router.push('/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property?.security_deposit || property.security_deposit <= 0) {
      toast.error('No security deposit required');
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus('processing');

    try {
      const response = await paymentsApi.initiate({
        booking_id: Number(id),
        payment_method: 'MPESA',
        phone_number: phoneNumber.replace(/[^0-9]/g, ''), // Clean phone
      });

      const { transaction_id } = response.data;
      setTransactionId(transaction_id);
      
      // Poll for status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await paymentsApi.getMpesaStatus(transaction_id);
          if (statusResponse.data.status === 'COMPLETED') {
            clearInterval(pollInterval);
            setPaymentStatus('success');
            toast.success('Security deposit paid successfully!');
            setTimeout(() => router.push(`/bookings/${id}`), 2000);
          } else if (statusResponse.data.status === 'FAILED') {
            clearInterval(pollInterval);
            setPaymentStatus('error');
            toast.error('Payment failed. Please try again.');
          }
        } catch (err) {
          // Continue polling
        }
      }, 3000);

      // Stop polling after 5 minutes
      setTimeout(() => clearInterval(pollInterval), 300000);

    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      toast.error(error.response?.data?.message || 'Payment initiation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!booking || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Payment Not Available</h1>
          <Link href="/bookings" className="text-primary-500 hover:underline">
            ← Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const depositAmount = property.security_deposit;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/bookings" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            ← Back to My Bookings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Pay Security Deposit</h1>
          <p className="mt-2 text-lg text-gray-600">
            Secure your booking with a refundable security deposit
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Property Card */}
          <div className="p-8 border-b">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <img
                  src={property.featured_image}
                  alt={property.title}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 truncate">{property.title}</h2>
                <p className="text-gray-600">{property.city}</p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-primary-500 mb-2">
                KES {depositAmount.toLocaleString()}
              </div>
              <p className="text-gray-600">Security Deposit (Refundable)</p>
            </div>

            {/* Phone Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="2547XXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  disabled={isSubmitting || paymentStatus !== 'idle'}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter M-Pesa phone number. You'll receive a payment prompt.
                </p>
              </div>

              {paymentStatus === 'processing' && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Waiting for M-Pesa confirmation... Check your phone
                  </p>
                  {transactionId && (
                    <p className="text-sm text-gray-500 mt-2">Transaction: {transactionId}</p>
                  )}
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</p>
                  <p className="text-gray-600">Redirecting to booking details...</p>
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-red-800">Payment Failed</p>
                  <button
                    type="submit"
                    className="mt-4 bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || paymentStatus !== 'idle' || !phoneNumber || depositAmount <= 0}
                className="w-full bg-primary-500 text-white py-4 px-6 rounded-xl hover:bg-primary-600 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Initiating Payment...</span>
                  </>
                ) : (
                  'Pay Security Deposit with M-Pesa'
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold mb-4">What is this for?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Refundable security deposit to cover potential damages</li>
                <li>• Fully refunded after checkout if no issues</li>
                <li>• Required to confirm your booking</li>
                <li>• Processed securely via M-Pesa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

