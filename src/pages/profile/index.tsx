import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string;
  role: string;
  email_verified: boolean;
  phone_verified: boolean;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData({
          first_name: parsedUser.first_name || '',
          last_name: parsedUser.last_name || '',
          phone_number: parsedUser.phone_number || '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.updateProfile(formData);
      toast.success('Profile updated successfully!');
      
      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser as User);
      setEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-500">FamilyStay</Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-gray-600">Dashboard</Link>
            <Link href="/search" className="text-gray-600">Explore</Link>
            <button onClick={handleLogout} className="text-gray-600">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Profile Information</h2>
            <button 
              onClick={() => setEditing(!editing)} 
              className="btn-outline"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-gray-600">@{user?.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Phone</label>
                  <p className="font-medium">{user?.phone_number || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Role</label>
                  <p className="font-medium capitalize">{user?.role?.toLowerCase()}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email Verified</label>
                  <span className={`badge ${user?.email_verified ? 'badge-success' : 'badge-warning'}`}>
                    {user?.email_verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="254XXXXXXXXX"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input bg-gray-100"
                  value={user?.email || ''}
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-gray-500">Update your password</p>
              </div>
              <Link href="/auth/change-password" className="btn-outline">Change</Link>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <h3 className="font-medium">Notification Settings</h3>
                <p className="text-sm text-gray-500">Manage email notifications</p>
              </div>
              <Link href="notifications" className="btn-outline">Manage</Link>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <h3 className="font-medium text-red-600">Delete Account</h3>
                <p className="text-sm text-gray-500">Permanently delete your account</p>
              </div>
              <button className="btn-outline text-red-500 border-red-500 hover:bg-red-50">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}