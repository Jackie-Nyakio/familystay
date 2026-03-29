import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://margurite-nonvalid-harper.ngrok-free.dev/api';
const BASE_DOMAIN = API_BASE_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true,
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const fixImageUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  // Cloudinary URLs are already absolute and correct — return as-is
  if (url.startsWith('https://res.cloudinary.com')) return url;
  // Keep the fallback for any non-image absolute URLs
  if (url.startsWith('http')) return url;
  // Relative paths (shouldn't happen after Cloudinary, but just in case)
  if (url.startsWith('/media') || url.startsWith('/static')) {
    return `${BASE_DOMAIN}${url}`;
  }
  return url;
};

const IMAGE_KEYS = ['image', 'photo', 'picture', 'avatar', 'thumbnail', 'featured', 'featured_image'];

const processObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(processObject);

  const processed: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      const lowerKey = key.toLowerCase();
      const isImageField = IMAGE_KEYS.some(k => lowerKey.includes(k));
      const isImageUrl =
        value.includes('/media/') ||
        value.includes('/static/') ||
        /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(value);

      processed[key] = isImageField || isImageUrl ? fixImageUrl(value) : value;
    } else if (typeof value === 'object' && value !== null) {
      processed[key] = processObject(value);
    } else {
      processed[key] = value;
    }
  }
  return processed;
};

// ── Request interceptor: attach auth token ────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: fix image URLs + handle token refresh ───────────────

api.interceptors.response.use(
  (response) => {
    response.data = processObject(response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = res.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: any) => api.post('/auth/register/', data),
  login: (credentials: any) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/', { refresh_token: localStorage.getItem('refresh_token') }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => api.patch('/auth/profile/', data),
  changePassword: (data: any) => api.post('/auth/password/change/', data),
  requestPasswordReset: (email: string) => api.post('/auth/password-reset/', { email }),
};

// ── Properties API ────────────────────────────────────────────────────────────

export const propertiesApi = {
  list: (params?: any) => api.get('/properties/', { params }),
  get: (id: number) => api.get(`/properties/${id}/`),
  getAvailability: (id: number, startDate?: string, endDate?: string) =>
    api.get(`/properties/${id}/availability/`, { params: { start_date: startDate, end_date: endDate } }),
  // Host endpoints
  getMyProperties: () => api.get('/properties/host/properties/'),
  createProperty: (data: any) => api.post('/properties/host/create/', data),
  updateProperty: (id: number, data: any) => api.patch(`/properties/host/${id}/update/`, data),
  deleteProperty: (id: number) => api.delete(`/properties/host/${id}/delete/`),
  uploadImages: (id: number, formData: FormData) =>
    api.post(`/properties/host/${id}/images/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  bulkUpdateAvailability: (id: number, data: any) =>
    api.post(`/properties/host/${id}/availability/bulk/`, data),
  // Admin endpoints
  approveProperty: (id: number) => api.post(`/properties/admin/${id}/approve/`),
  rejectProperty: (id: number) => api.post(`/properties/admin/${id}/reject/`),
  blockProperty: (id: number) => api.post(`/properties/admin/${id}/block/`),
};

// ── Bookings API ──────────────────────────────────────────────────────────────

export const bookingsApi = {
  create: (data: any) => api.post('/bookings/create/', data),
  list: (params?: any) => api.get('/bookings/my-bookings/', { params }),
  detail: (id: string | number) => api.get(`/bookings/${id}/`),
  get: (id: number) => api.get(`/bookings/${id}/`),
  cancel: (id: number, reason?: string) => api.post(`/bookings/${id}/cancel/`, { cancellation_reason: reason }),
  modify: (id: number, data: any) => api.post(`/bookings/${id}/modify/`, data),
  getHistory: (id: number) => api.get(`/bookings/${id}/history/`),
  // Host endpoints
  getHostBookings: (params?: any) => api.get('/bookings/host/bookings/', { params }),
  updateBookingStatus: (id: number, status: string) =>
    api.post(`/bookings/host/${id}/update-status/`, { status }),
};

// ── Payments API ──────────────────────────────────────────────────────────────

export const paymentsApi = {
  initiate: (data: any) => api.post('/payments/initiate/', data),
  getMpesaStatus: (transactionId: string) => api.get(`/payments/mpesa/status/${transactionId}/`),
  list: () => api.get('/payments/history/'),
  get: (id: number) => api.get(`/payments/${id}/`),
  requestPayout: (data: any) => api.post('/payments/payouts/request/', data),
  getPayoutHistory: () => api.get('/payments/payouts/history/'),
};

// ── Reviews API ───────────────────────────────────────────────────────────────

export const reviewsApi = {
  create: (data: any) => api.post('/reviews/create/', data),
  getPropertyReviews: (propertyId: number, params?: any) =>
    api.get(`/reviews/property/${propertyId}/`, { params }),
  update: (id: number, data: any) => api.patch(`/reviews/${id}/`, data),
  delete: (id: number) => api.delete(`/reviews/${id}/delete/`),
  reply: (id: number, reply: string) => api.post(`/reviews/${id}/reply/`, { host_reply: reply }),
  report: (id: number, data: any) => api.post(`/reviews/${id}/report/`, data),
  moderate: (id: number, action: string) => api.post(`/reviews/admin/${id}/moderate/`, { action }),
};

// ── Communications API ────────────────────────────────────────────────────────

export const communicationsApi = {
  listConversations: () => api.get('/communications/conversations/'),
  createConversation: (data: any) => api.post('/communications/conversations/create/', data),
  getConversation: (id: number) => api.get(`/communications/conversations/${id}/`),
  sendMessage: (conversationId: number, content: string, attachments?: string[]) =>
    api.post(`/communications/conversations/${conversationId}/send/`, { content, attachments }),
  markMessageRead: (messageId: number) => api.post(`/communications/messages/${messageId}/read/`),
  listNotifications: (params?: any) => api.get('/communications/notifications/', { params }),
  markNotificationRead: (id: number) => api.post(`/communications/notifications/${id}/read/`),
  markAllNotificationsRead: () => api.post('/communications/notifications/read-all/'),
};

export default api;