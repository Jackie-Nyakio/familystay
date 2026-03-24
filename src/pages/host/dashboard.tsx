import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { propertiesApi, bookingsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  base_price: number;
  cleaning_fee: number;
  service_fee: number;
  security_deposit: number;
  featured_image: string;
  images: { id: number; image: string; is_featured: boolean }[];
  status: string;
  is_available: boolean;
  amenities?: any;
  family_features?: any;
}

interface Booking {
  id: number;
  booking_reference: string;
  guest: { name: string; email: string };
  listing: { title: string };
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  booking_status: string;
}

export default function HostDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  
  // Add Property states
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  
  // Edit property states
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'Kenya',
    zip_code: '',
    property_type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    base_price: '',
    cleaning_fee: '0',
    service_fee: '0',
    security_deposit: '0',
    amenities: {} as Record<string, boolean>,
    family_features: {} as Record<string, boolean>,
    is_available: true,
  });
  
  // Edit image states
  const [newFeaturedImage, setNewFeaturedImage] = useState<File | null>(null);
  const [newFeaturedImagePreview, setNewFeaturedImagePreview] = useState<string>('');
  const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
  const [newGalleryImagePreviews, setNewGalleryImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  
  const editFeaturedImageInputRef = useRef<HTMLInputElement>(null);
  const editGalleryImageInputRef = useRef<HTMLInputElement>(null);
  
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'Kenya',
    zip_code: '',
    property_type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    base_price: '',
    cleaning_fee: '0',
    service_fee: '0',
    security_deposit: '0',
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const propsRes = await propertiesApi.getMyProperties();
      setProperties(propsRes.data.results || propsRes.data || []);
      const bookingsRes = await bookingsApi.getHostBookings();
      setBookings(bookingsRes.data.results || bookingsRes.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Add Property handlers
  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setGalleryImages(prev => [...prev, ...filesArray]);
      
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    if (galleryImageInputRef.current) {
      galleryImageInputRef.current.value = '';
    }
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
    setFeaturedImagePreview('');
    if (featuredImageInputRef.current) {
      featuredImageInputRef.current.value = '';
    }
  };

  // Edit Property handlers
  const openEditModal = (property: Property) => {
    setEditingProperty(property);
    setEditForm({
      title: property.title || '',
      description: property.description || '',
      address: property.address || '',
      city: property.city || '',
      state: property.state || '',
      country: property.country || 'Kenya',
      zip_code: property.zip_code || '',
      property_type: property.property_type || 'Apartment',
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      max_guests: property.max_guests || 2,
      base_price: String(property.base_price || ''),
      cleaning_fee: String(property.cleaning_fee || '0'),
      service_fee: String(property.service_fee || '0'),
      security_deposit: String(property.security_deposit || '0'),
      amenities: property.amenities || {},
      family_features: property.family_features || {},
      is_available: property.is_available,
    });
    
    // Reset edit image states
    setNewFeaturedImage(null);
    setNewFeaturedImagePreview('');
    setNewGalleryImages([]);
    setNewGalleryImagePreviews([]);
    setImagesToDelete([]);
    
    setShowEditModal(true);
  };

  const handleEditFormChange = (field: string, value: any) => {
  setEditForm({ ...editForm, [field]: value });
};

  const handleEditFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setNewGalleryImages(prev => [...prev, ...filesArray]);
      
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewGalleryImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeEditGalleryImage = (index: number) => {
    setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
    setNewGalleryImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    if (editGalleryImageInputRef.current) {
      editGalleryImageInputRef.current.value = '';
    }
  };

  const removeEditFeaturedImage = () => {
    setNewFeaturedImage(null);
    setNewFeaturedImagePreview('');
    if (editFeaturedImageInputRef.current) {
      editFeaturedImageInputRef.current.value = '';
    }
  };

  const markImageForDeletion = (imageId: number) => {
    setImagesToDelete(prev => [...prev, imageId]);
  };

 const handleSaveProperty = async () => {
  if (!editingProperty) return;
  setEditLoading(true);

  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      toast.error('Your session has expired. Please login again.');
      router.push('/auth/login');
      return;
    }

    // Update property details
    const updateData = {
      ...editForm,
      base_price: parseFloat(editForm.base_price) || 0,
      cleaning_fee: parseFloat(editForm.cleaning_fee) || 0,
      service_fee: parseFloat(editForm.service_fee) || 0,
      security_deposit: parseFloat(editForm.security_deposit) || 0,
    };

    // FIX: Add /host/ to the URL path
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://fa4e-38-226-202-130.ngrok-free.app/api'}/properties/host/${editingProperty.id}/update/`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Delete marked images - FIX these URLs too
    if (imagesToDelete.length > 0) {
      for (const imageId of imagesToDelete) {
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://fa4e-38-226-202-130.ngrok-free.app/api'}/properties/host/${editingProperty.id}/images/${imageId}/`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error(`Failed to delete image ${imageId}:`, error);
        }
      }
    }

    // Upload new featured image - FIX this URL too
    if (newFeaturedImage) {
      const featuredFormData = new FormData();
      featuredFormData.append('featured_image', newFeaturedImage);
      
      // You might need a specific endpoint for updating featured image
      // If not, you can use the image upload endpoint and set one as featured
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://fa4e-38-226-202-130.ngrok-free.app/api'}/properties/host/${editingProperty.id}/images/`,
        featuredFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }

    // Upload new gallery images - FIX this URL too
    if (newGalleryImages.length > 0) {
      const galleryFormData = new FormData();
      newGalleryImages.forEach((image) => {
        galleryFormData.append('images', image);
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://fa4e-38-226-202-130.ngrok-free.app/api'}/properties/host/${editingProperty.id}/images/`,
        galleryFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }

    toast.success('Property updated successfully!');
    setShowEditModal(false);
    fetchData();
  } catch (error: any) {
    console.error('Error updating property:', error);
    
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'string') {
        toast.error(errorData);
      } else if (errorData.message) {
        toast.error(errorData.message);
      } else if (errorData.detail) {
        toast.error(errorData.detail);
      } else {
        const errors = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        toast.error(errors || 'Failed to update property');
      }
    } else {
      toast.error('Failed to update property');
    }
  } finally {
    setEditLoading(false);
  }
};

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        toast.error('Your session has expired. Please login again.');
        router.push('/auth/login');
        return;
      }

      if (!featuredImage) {
        toast.error('Please upload a featured image for your property');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      
      Object.entries(propertyForm).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });
      
      formData.append('is_available', 'true');
      formData.append('featured_image', featuredImage);
      
      if (galleryImages.length > 0) {
        galleryImages.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://fa4e-38-226-202-130.ngrok-free.app/api'}/properties/host/create/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Property created successfully!');
      setShowAddProperty(false);
      
      setPropertyForm({
        title: '', description: '', address: '', city: '', state: '',
        country: 'Kenya', zip_code: '', property_type: 'Apartment',
        bedrooms: 1, bathrooms: 1, max_guests: 2, base_price: '',
        cleaning_fee: '0', service_fee: '0', security_deposit: '0',
      });
      
      setFeaturedImage(null);
      setFeaturedImagePreview('');
      setGalleryImages([]);
      setGalleryImagePreviews([]);
      
      if (featuredImageInputRef.current) {
        featuredImageInputRef.current.value = '';
      }
      if (galleryImageInputRef.current) {
        galleryImageInputRef.current.value = '';
      }
      
      fetchData();
    } catch (error: any) {
      console.error('Error creating property:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'string') {
          toast.error(errorData);
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else if (errorData.detail) {
          toast.error(errorData.detail);
        } else if (errorData.featured_image) {
          toast.error(`Featured image error: ${errorData.featured_image}`);
        } else {
          const errors = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          toast.error(errors || 'Failed to create property');
        }
      } else {
        toast.error('Failed to create property');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatus = async (id: number, status: string) => {
    try {
      await bookingsApi.updateBookingStatus(id, status);
      toast.success(`Booking ${status.toLowerCase()}!`);
      fetchData();
    } catch (error: any) {
      toast.error('Failed to update booking');
    }
  };

const handleToggleAvailability = async (property: Property) => {
  try {
    console.log('Toggling availability for property:', property.id);
    console.log('Current availability:', property.is_available);
    console.log('New availability:', !property.is_available);
    
    const response = await propertiesApi.updateProperty(property.id, { 
      is_available: !property.is_available 
    });
    
    console.log('Update response:', response);
    toast.success(`Property ${!property.is_available ? 'enabled' : 'disabled'} successfully!`);
    fetchData();
  } catch (error: any) {
    console.error('Full error object:', error);
    console.error('Error response:', error.response);
    console.error('Error data:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    // Show more specific error message
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'string') {
        toast.error(`Failed: ${errorData}`);
      } else if (errorData.message) {
        toast.error(`Failed: ${errorData.message}`);
      } else if (errorData.detail) {
        toast.error(`Failed: ${errorData.detail}`);
      } else if (errorData.error) {
        toast.error(`Failed: ${errorData.error}`);
      } else {
        toast.error('Failed to update property availability');
      }
    } else if (error.request) {
      toast.error('Network error - please check your connection');
    } else {
      toast.error('Failed to update property availability');
    }
  }
};
  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }
    
    try {
      await propertiesApi.deleteProperty(propertyId);
      toast.success('Property deleted successfully!');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to delete property');
    }
  };

  if (loading && properties.length === 0) {
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
            <Link href="/search" className="text-gray-600 hover:text-primary-500">Explore</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-500">Guest Dashboard</Link>
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
        <h1 className="text-3xl font-bold mb-2">Host Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage your properties and bookings</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-500">{properties.length}</div>
            <div className="text-gray-600">Properties</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-500">{bookings.filter(b => b.booking_status === 'PENDING').length}</div>
            <div className="text-gray-600">Pending Bookings</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-500">{bookings.filter(b => b.booking_status === 'CONFIRMED').length}</div>
            <div className="text-gray-600">Confirmed Bookings</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-500">KES {bookings.reduce((sum, booking) => sum + Number(booking.total_amount), 0).toLocaleString()}</div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('properties')} 
              className={`flex-1 py-4 text-center ${
                activeTab === 'properties' 
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Properties
            </button>
            <button 
              onClick={() => setActiveTab('bookings')} 
              className={`flex-1 py-4 text-center ${
                activeTab === 'bookings' 
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bookings
            </button>
          </div>

          {activeTab === 'properties' && (
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">My Properties</h2>
                <button 
                  onClick={() => setShowAddProperty(!showAddProperty)} 
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                >
                  {showAddProperty ? 'Cancel' : '+ Add Property'}
                </button>
              </div>

              {showAddProperty && (
                <form onSubmit={handleAddProperty} className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6 space-y-6">
                  <h3 className="text-lg font-bold mb-4">Add New Property</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Cozy Family Villa" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.title} 
                        onChange={e => setPropertyForm({...propertyForm, title: e.target.value})} 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.property_type} 
                        onChange={e => setPropertyForm({...propertyForm, property_type: e.target.value})}
                      >
                        <option>Apartment</option>
                        <option>House</option>
                        <option>Villa</option>
                        <option>Cottage</option>
                        <option>Cabin</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea 
                        placeholder="Describe your property..." 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        rows={3} 
                        value={propertyForm.description} 
                        onChange={e => setPropertyForm({...propertyForm, description: e.target.value})} 
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <input 
                        type="text" 
                        placeholder="Street address" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.address} 
                        onChange={e => setPropertyForm({...propertyForm, address: e.target.value})} 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Nairobi" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.city} 
                        onChange={e => setPropertyForm({...propertyForm, city: e.target.value})} 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/County</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Nairobi County" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.state} 
                        onChange={e => setPropertyForm({...propertyForm, state: e.target.value})} 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 00100" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.zip_code} 
                        onChange={e => setPropertyForm({...propertyForm, zip_code: e.target.value})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.country} 
                        onChange={e => setPropertyForm({...propertyForm, country: e.target.value})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
                      <input 
                        type="number" 
                        min="1" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.bedrooms} 
                        onChange={e => setPropertyForm({...propertyForm, bedrooms: parseInt(e.target.value) || 1})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
                      <input 
                        type="number" 
                        min="1" 
                        step="0.5" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.bathrooms} 
                        onChange={e => setPropertyForm({...propertyForm, bathrooms: parseFloat(e.target.value) || 1})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests *</label>
                      <input 
                        type="number" 
                        min="1" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.max_guests} 
                        onChange={e => setPropertyForm({...propertyForm, max_guests: parseInt(e.target.value) || 1})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (KES/night) *</label>
                      <input 
                        type="number" 
                        min="0" 
                        placeholder="Per night" 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.base_price} 
                        onChange={e => setPropertyForm({...propertyForm, base_price: e.target.value})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Fee (KES)</label>
                      <input 
                        type="number" 
                        min="0" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.cleaning_fee} 
                        onChange={e => setPropertyForm({...propertyForm, cleaning_fee: e.target.value})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Fee (KES)</label>
                      <input 
                        type="number" 
                        min="0" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.service_fee} 
                        onChange={e => setPropertyForm({...propertyForm, service_fee: e.target.value})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (KES)</label>
                      <input 
                        type="number" 
                        min="0" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={propertyForm.security_deposit} 
                        onChange={e => setPropertyForm({...propertyForm, security_deposit: e.target.value})} 
                      />
                    </div>
                  </div>

                  {/* Featured Image Section */}
                  <div className="border-t pt-4">
                    <h4 className="text-md font-semibold mb-3">Featured Image *</h4>
                    <p className="text-sm text-gray-500 mb-2">This will be the main image displayed in search results</p>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*" 
                          ref={featuredImageInputRef} 
                          onChange={handleFeaturedImageChange} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                          required={!featuredImage}
                        />
                      </div>
                      
                      {featuredImagePreview && (
                        <div className="relative w-32 h-32">
                          <img 
                            src={featuredImagePreview} 
                            alt="Featured preview" 
                            className="w-full h-full object-cover rounded-lg border-2 border-primary-500"
                          />
                          <button
                            type="button"
                            onClick={removeFeaturedImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-1 left-1 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Images Section */}
                  <div className="border-t pt-4">
                    <h4 className="text-md font-semibold mb-3">Gallery Images (Optional)</h4>
                    <p className="text-sm text-gray-500 mb-2">Add multiple photos of your property</p>
                    
                    <div className="mb-4">
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        ref={galleryImageInputRef} 
                        onChange={handleGalleryImagesChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                      />
                    </div>
                    
                    {galleryImagePreviews.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gallery Images ({galleryImagePreviews.length}):
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {galleryImagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={preview} 
                                alt={`Gallery ${index + 1}`} 
                                className="h-24 w-full object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowAddProperty(false);
                        setFeaturedImage(null);
                        setFeaturedImagePreview('');
                        setGalleryImages([]);
                        setGalleryImagePreviews([]);
                        setPropertyForm({
                          title: '', description: '', address: '', city: '', state: '',
                          country: 'Kenya', zip_code: '', property_type: 'Apartment',
                          bedrooms: 1, bathrooms: 1, max_guests: 2, base_price: '',
                          cleaning_fee: '0', service_fee: '0', security_deposit: '0',
                        });
                      }} 
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading || !featuredImage} 
                      className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating...' : 'Create Property'}
                    </button>
                  </div>
                </form>
              )}

              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map(property => (
                    <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow">
                      <div className="h-48 bg-gray-200">
                        {property.featured_image ? (
                          <img 
                            src={property.featured_image} 
                            alt={property.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0].image} 
                            alt={property.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                        <p className="text-gray-600 text-sm mb-1">{property.city}, {property.country}</p>
                        <p className="text-gray-500 text-sm mb-2">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''} • {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''} • {property.max_guests} guests</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-primary-500">KES {Number(property.base_price).toLocaleString()}<span className="text-sm font-normal text-gray-500">/night</span></span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            property.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800' 
                              : property.status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                        
                        {/* Image count indicator */}
                        {property.images && property.images.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            📸 {property.images.length} gallery image{property.images.length !== 1 ? 's' : ''}
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-4 pt-3 border-t">
                          <button 
                            onClick={() => openEditModal(property)}
                            className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleToggleAvailability(property)}
                            className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                              property.is_available 
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                          >
                            {property.is_available ? 'Disable' : 'Enable'}
                          </button>
                          <button 
                            onClick={() => handleDeleteProperty(property.id)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                        
                        <div className="mt-2 text-center">
                          <span className={`text-xs ${property.is_available ? 'text-green-600' : 'text-red-600'}`}>
                            {property.is_available ? '✓ Property is live' : '✗ Property is not available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-12 text-center rounded-lg">
                  <div className="text-4xl mb-4">🏠</div>
                  <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first property to list on FamilyStay</p>
                  <button 
                    onClick={() => setShowAddProperty(true)} 
                    className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Add Your First Property
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Booking Requests</h2>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-lg">{booking.listing?.title || 'Property'}</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.booking_status === 'PENDING' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.booking_status === 'CONFIRMED' 
                                ? 'bg-green-100 text-green-800'
                                : booking.booking_status === 'COMPLETED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.booking_status}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Guest:</span> {booking.guest?.name || 'Guest'} 
                            {booking.guest?.email && <span className="text-gray-500 text-sm ml-2">({booking.guest.email})</span>}
                          </p>
                          
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Check-in:</span> {new Date(booking.check_in_date).toLocaleDateString()}
                          </p>
                          
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Check-out:</span> {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                          
                          <p className="text-gray-700">
                            <span className="font-medium">Total:</span> KES {Number(booking.total_amount).toLocaleString()}
                          </p>
                          
                          {booking.booking_reference && (
                            <p className="text-xs text-gray-500 mt-1">Ref: {booking.booking_reference}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 md:w-48">
                          {booking.booking_status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleBookingStatus(booking.id, 'CONFIRMED')} 
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Accept Booking
                              </button>
                              <button 
                                onClick={() => handleBookingStatus(booking.id, 'CANCELLED')} 
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Decline Booking
                              </button>
                            </>
                          )}
                          
                          {booking.booking_status === 'CONFIRMED' && (
                            <button 
                              onClick={() => handleBookingStatus(booking.id, 'COMPLETED')} 
                              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                            >
                              Mark as Completed
                            </button>
                          )}
                          
                          {booking.booking_status === 'COMPLETED' && (
                            <p className="text-center text-gray-500 py-2">Completed</p>
                          )}
                          
                          {booking.booking_status === 'CANCELLED' && (
                            <p className="text-center text-red-500 py-2">Cancelled</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-12 text-center rounded-lg">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold mb-2">No booking requests</h3>
                  <p className="text-gray-600">When guests book your properties, they'll appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Property Modal */}
      {/* Edit Property Modal */}
{showEditModal && editingProperty && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Property: {editingProperty.title}</h2>
        <button 
          onClick={() => setShowEditModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input 
                type="text" 
                value={editForm.title} 
                onChange={(e) => handleEditFormChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
              <select 
                value={editForm.property_type} 
                onChange={(e) => handleEditFormChange('property_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
                <option>Cottage</option>
                <option>Cabin</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea 
                value={editForm.description} 
                onChange={(e) => handleEditFormChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input 
                type="text" 
                value={editForm.address} 
                onChange={(e) => handleEditFormChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input 
                type="text" 
                value={editForm.city} 
                onChange={(e) => handleEditFormChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State/County</label>
              <input 
                type="text" 
                value={editForm.state} 
                onChange={(e) => handleEditFormChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
              <input 
                type="text" 
                value={editForm.zip_code} 
                onChange={(e) => handleEditFormChange('zip_code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <input 
                type="text" 
                value={editForm.country} 
                onChange={(e) => handleEditFormChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
              <input 
                type="number" 
                min="1" 
                value={editForm.bedrooms} 
                onChange={(e) => handleEditFormChange('bedrooms', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
              <input 
                type="number" 
                min="1" 
                step="0.5" 
                value={editForm.bathrooms} 
                onChange={(e) => handleEditFormChange('bathrooms', parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests *</label>
              <input 
                type="number" 
                min="1" 
                value={editForm.max_guests} 
                onChange={(e) => handleEditFormChange('max_guests', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Amenities */}
<div className="border-b pb-4">
  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {['wifi', 'kitchen', 'parking', 'air_conditioning', 'pool', 'gym', 'laundry', 'tv', 'washer', 'dryer'].map((amenity) => (
      <label key={amenity} className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          checked={editForm.amenities[amenity] || false}
          onChange={(e) => {
            setEditForm({
              ...editForm,
              amenities: {
                ...editForm.amenities,
                [amenity]: e.target.checked
              }
            });
          }}
        />
        <span className="text-sm text-gray-700 capitalize">{amenity.replace(/_/g, ' ')}</span>
      </label>
    ))}
  </div>
</div>

{/* Family Features */}
<div className="border-b pb-4">
  <h3 className="text-lg font-semibold mb-4">Family Features</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {['baby_crib', 'high_chair', 'play_area', 'child_safe', 'babysitter', 'stroller', 'child_lock', 'toy_room'].map((feature) => (
      <label key={feature} className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          checked={editForm.family_features[feature] || false}
          onChange={(e) => {
            setEditForm({
              ...editForm,
              family_features: {
                ...editForm.family_features,
                [feature]: e.target.checked
              }
            });
          }}
        />
        <span className="text-sm text-gray-700 capitalize">{feature.replace(/_/g, ' ')}</span>
      </label>
    ))}
  </div>
</div>
        
        {/* Pricing */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4">Pricing (KES)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (per night) *</label>
              <input 
                type="number" 
                min="0" 
                value={editForm.base_price} 
                onChange={(e) => handleEditFormChange('base_price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Fee</label>
              <input 
                type="number" 
                min="0" 
                value={editForm.cleaning_fee} 
                onChange={(e) => handleEditFormChange('cleaning_fee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Fee</label>
              <input 
                type="number" 
                min="0" 
                value={editForm.service_fee} 
                onChange={(e) => handleEditFormChange('service_fee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
              <input 
                type="number" 
                min="0" 
                value={editForm.security_deposit} 
                onChange={(e) => handleEditFormChange('security_deposit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
        
        {/* Current Images */}
        {editingProperty.images && editingProperty.images.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Current Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {editingProperty.images.map((img) => (
                <div key={img.id} className="relative group">
                  <img 
                    src={img.image} 
                    alt="Property" 
                    className={`h-24 w-full object-cover rounded-lg border-2 ${
                      img.is_featured ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  />
                  {img.is_featured && (
                    <span className="absolute top-1 left-1 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  {!img.is_featured && (
                    <button
                      type="button"
                      onClick={() => markImageForDeletion(img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Delete image"
                    >
                      ×
                    </button>
                  )}
                  {imagesToDelete.includes(img.id) && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Marked for deletion</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Note: Featured image cannot be deleted. You can replace it by uploading a new featured image.</p>
          </div>
        )}
        
        {/* Upload New Featured Image */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Replace Featured Image</h3>
          <p className="text-sm text-gray-500 mb-2">Upload a new featured image to replace the current one</p>
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input 
                type="file" 
                accept="image/*" 
                ref={editFeaturedImageInputRef} 
                onChange={handleEditFeaturedImageChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>
            
            {newFeaturedImagePreview && (
              <div className="relative w-32 h-32">
                <img 
                  src={newFeaturedImagePreview} 
                  alt="New featured preview" 
                  className="w-full h-full object-cover rounded-lg border-2 border-primary-500"
                />
                <button
                  type="button"
                  onClick={removeEditFeaturedImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
                <span className="absolute bottom-1 left-1 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                  New Featured
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Upload New Gallery Images */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Add Gallery Images</h3>
          <p className="text-sm text-gray-500 mb-2">Add new photos to your property gallery</p>
          
          <div className="mb-4">
            <input 
              type="file" 
              accept="image/*" 
              multiple
              ref={editGalleryImageInputRef} 
              onChange={handleEditGalleryImagesChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
            />
          </div>
          
          {newGalleryImagePreviews.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Gallery Images ({newGalleryImagePreviews.length}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {newGalleryImagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`New gallery ${index + 1}`} 
                      className="h-24 w-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeEditGalleryImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Availability Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-lg font-semibold">Property Availability</h3>
            <p className="text-sm text-gray-500">Toggle whether this property is available for booking</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={editForm.is_available}
              onChange={(e) => handleEditFormChange('is_available', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {editForm.is_available ? 'Available' : 'Not Available'}
            </span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
        <button 
          onClick={() => setShowEditModal(false)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveProperty}
          disabled={editLoading}
          className="bg-primary-500 text-white px-8 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {editLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}