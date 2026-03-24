import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import AuthLayout from '@/components/layout/AuthLayout';

interface ChangePasswordFormData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

interface FormErrors {
  old_password?: string;
  new_password?: string;
  new_password_confirm?: string;
}

export default function ChangePassword() {
  const router = useRouter();
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.old_password.trim()) {
      newErrors.old_password = 'Current password is required';
    }
    
    if (!formData.new_password.trim()) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    
    if (!formData.new_password_confirm.trim()) {
      newErrors.new_password_confirm = 'Please confirm your new password';
    } else if (formData.new_password !== formData.new_password_confirm) {
      newErrors.new_password_confirm = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await authApi.changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
        new_password_confirm: formData.new_password_confirm
      });
      
      toast.success('Password changed successfully!');
      
      // Clear form
      setFormData({
        old_password: '',
        new_password: '',
        new_password_confirm: ''
      });
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Password change error:', error);
      
      // Handle different error formats
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.old_password) {
          setErrors(prev => ({ ...prev, old_password: errorData.old_password[0] || errorData.old_password }));
        } else if (errorData.new_password) {
          setErrors(prev => ({ ...prev, new_password: errorData.new_password[0] || errorData.new_password }));
        } else if (errorData.detail) {
          toast.error(errorData.detail);
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else if (typeof errorData === 'string') {
          toast.error(errorData);
        } else {
          toast.error('Failed to change password. Please check your current password.');
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-10V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v4m-4 4h8" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password *
              </label>
              <input
                type="password"
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errors.old_password ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Enter current password"
              />
              {errors.old_password && (
                <p className="mt-1 text-sm text-red-500">{errors.old_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errors.new_password ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Enter new password (min 8 characters)"
              />
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-500">{errors.new_password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                name="new_password_confirm"
                value={formData.new_password_confirm}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errors.new_password_confirm ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Confirm new password"
              />
              {errors.new_password_confirm && (
                <p className="mt-1 text-sm text-red-500">{errors.new_password_confirm}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changing Password...
                </span>
              ) : (
                'Change Password'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/dashboard" 
              className="text-sm text-primary-500 hover:text-primary-600 inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}