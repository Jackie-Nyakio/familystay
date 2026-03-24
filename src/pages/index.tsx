import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { propertiesApi } from '@/lib/api';

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

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
    
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    setLoading(true);
    try {
      const response = await propertiesApi.list({
        status: 'APPROVED',
        is_available: true
      });
      const props = response.data.results || response.data || [];
      setFeaturedProperties(props.slice(0, 6)); // Limit to 6 properties
    } catch (error) {
      console.error('Error fetching properties:', error);
      setFeaturedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: {
        city: searchQuery.location,
        check_in: searchQuery.checkIn,
        check_out: searchQuery.checkOut,
        guests: searchQuery.guests,
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-500">
                FamilyStay
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/search" className="text-gray-600 hover:text-primary-500">
                Explore
              </Link>
              {!isLoggedIn && (
                <Link href="/host/become-host" className="text-gray-600 hover:text-primary-500">
                  Become a Host
                </Link>
              )}
              <Link href="/about" className="text-gray-600 hover:text-primary-500">
                About Us
              </Link>
              <Link href="/careers" className="text-gray-600 hover:text-primary-500">
                Careers
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-primary-500">
                    Dashboard
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

      {/* Hero Section */}
      <section className="relative bg-gray-900 h-[500px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920"
            alt="Family vacation"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Family Getaway
            </h1>
            <p className="text-xl mb-8">
              Discover unique homes and experiences around Kenya
            </p>
            
            {/* Search Box */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg p-4 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="input"
                    value={searchQuery.location}
                    onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check in
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={searchQuery.checkIn}
                    onChange={(e) => setSearchQuery({ ...searchQuery, checkIn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check out
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={searchQuery.checkOut}
                    onChange={(e) => setSearchQuery({ ...searchQuery, checkOut: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <select
                    className="input"
                    value={searchQuery.guests}
                    onChange={(e) => setSearchQuery({ ...searchQuery, guests: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="mt-4 w-full btn-primary">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Properties
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties available yet.</p>
              {isLoggedIn && userRole === 'HOST' && (
                <Link href="/host/dashboard" className="btn-primary mt-4 inline-block">
                  Add Your First Property
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Beachfront', icon: '🏖️' },
              { name: 'Cabins', icon: '🏚️' },
              { name: 'Villas', icon: '🏰' },
              { name: 'Apartments', icon: '🏢' },
              { name: 'Countryside', icon: '🌾' },
              { name: 'City', icon: '🏙️' },
              { name: 'Lakefront', icon: '🌊' },
              { name: 'Unique', icon: '✨' },
            ].map((category) => (
              <Link href={`/search?property_type=${category.name}`} key={category.name}>
                <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FamilyStay</h3>
              <p className="text-gray-400">
                Your trusted platform for family-friendly vacation rentals across Kenya.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
                <li><Link href="/cancellation" className="hover:text-white">Cancellation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} FamilyStay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}