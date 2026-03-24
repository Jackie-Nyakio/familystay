import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { propertiesApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Property {
  id: number;
  title: string;
  city: string;
  country: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  base_price: number;
  featured_image: string;
  images: any[];
  host_name: string;
  average_rating: number;
  is_available: boolean;
  status: string;
}

export default function Search() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  
  // Filter states
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
    
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertiesApi.list({
        status: 'APPROVED',
        is_available: true
      });
      setProperties(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params: any = {
        status: 'APPROVED',
        is_available: true
      };
      
      if (searchLocation) {
        params.city = searchLocation;
      }
      if (guests) {
        params.max_guests = parseInt(guests);
      }
      
      const response = await propertiesApi.list(params);
      setProperties(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/');
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
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-primary-500">
                    Dashboard
                  </Link>
                  <Link href="/bookings" className="text-gray-600 hover:text-primary-500">
                    My Bookings
                  </Link>
                  {userRole === 'HOST' && (
                    <Link href="/host/dashboard" className="text-gray-600 hover:text-primary-500">
                      Host Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-gray-600 hover:text-primary-500">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-600 hover:text-primary-500">
                    Log in
                  </Link>
                  <Link href="/auth/register" className="btn-primary">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Location (city)"
              className="input flex-1 min-w-[200px]"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <input
              type="date"
              className="input"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <input
              type="date"
              className="input"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
            <select 
              className="input w-40"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            >
              <option value="">Guests</option>
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
              <option value="5">5+ guests</option>
            </select>
            <button onClick={handleSearch} className="btn-primary">
              Search
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {loading ? 'Loading...' : `${properties.length} properties found`}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Property Grid */}
        {!loading && properties.length > 0 && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {properties.map((property) => (
              <Link href={`/property/${property.id}`} key={property.id}>
                <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-48">
                    {property.featured_image ? (
                      <img
                        src={property.featured_image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {property.average_rating > 0 && (
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md flex items-center">
                        <span className="text-sm font-medium">★ {property.average_rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {property.city}, {property.country}
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      {property.bedrooms} beds • {property.bathrooms} baths • Up to {property.max_guests} guests
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-500">
                        KES {Number(property.base_price).toLocaleString()}
                        <span className="text-sm font-normal text-gray-500">/night</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or check back later for new listings.
            </p>
            {isLoggedIn && userRole === 'HOST' && (
              <Link href="/host/dashboard" className="btn-primary">
                Add Your Property
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}