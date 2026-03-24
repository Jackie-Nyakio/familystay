// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_picture?: string;
  role: 'GUEST' | 'HOST' | 'ADMIN';
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
  is_guest: boolean;
  is_host: boolean;
  is_admin: boolean;
}

export interface AuthTokens {
  refresh: string;
  access: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: 'GUEST' | 'HOST';
}

// Property Types
export interface PropertyImage {
  id: number;
  image: string;
  is_featured: boolean;
  caption?: string;
  uploaded_at: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  square_feet?: number;
  amenities: Record<string, boolean>;
  family_features: Record<string, boolean>;
  base_price: number;
  cleaning_fee: number;
  service_fee: number;
  security_deposit: number;
  featured_image: string;
  images: PropertyImage[];
  host: {
    id: number;
    name: string;
    profile_picture?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
  is_available: boolean;
  average_rating: number;
  total_reviews: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyListItem {
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
  images: PropertyImage[];
  host_name: string;
  average_rating: number;
  is_available: boolean;
  status: string;
}

export interface PropertyFilters {
  city?: string;
  country?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  min_price?: number;
  max_price?: number;
  amenities?: string[];
  family_features?: string[];
  search?: string;
  sort?: string;
}

export interface Availability {
  date: string;
  is_available: boolean;
  price_override?: number;
  is_booked: boolean;
}

// Booking Types
export interface GuestInfo {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  id_type?: string;
  id_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface Booking {
  id: number;
  booking_reference: string;
  guest: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  listing: {
    id: number;
    title: string;
    address: string;
    city: string;
    featured_image: string;
  };
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  number_of_children: number;
  special_requests?: string;
  nightly_price: number;
  total_nights: number;
  subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  tax_amount: number;
  total_amount: number;
  booking_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'REFUNDED';
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  cancellation_reason?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  guest_info?: GuestInfo;
}

export interface CreateBookingData {
  property_id: number;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  number_of_children?: number;
  special_requests?: string;
  guest_full_name: string;
  guest_email: string;
  guest_phone: string;
  guest_id_type?: string;
  guest_id_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

// Payment Types
export interface Payment {
  id: number;
  transaction_id: string;
  booking_reference: string;
  payer_name: string;
  recipient_name: string;
  payment_method: 'MPESA' | 'CARD' | 'PAYPAL' | 'BANK';
  amount: number;
  currency: string;
  status: 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  provider_reference?: string;
  description?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface Payout {
  id: number;
  reference: string;
  host_name: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  payout_method: 'MPESA' | 'BANK' | 'PAYPAL';
  requested_at: string;
  processed_at?: string;
}

// Review Types
export interface Review {
  id: number;
  guest: User;
  property: number;
  property_title: string;
  host: number;
  overall_rating: number;
  cleanliness_rating: number;
  communication_rating: number;
  checkin_rating: number;
  accuracy_rating: number;
  location_rating: number;
  value_rating: number;
  child_friendly_rating?: number;
  safety_rating?: number;
  comment: string;
  host_reply?: string;
  host_replied_at?: string;
  images: string[];
  is_approved: boolean;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  booking_id: number;
  overall_rating: number;
  cleanliness_rating: number;
  communication_rating: number;
  checkin_rating: number;
  accuracy_rating: number;
  location_rating: number;
  value_rating: number;
  child_friendly_rating?: number;
  safety_rating?: number;
  comment: string;
  images?: string[];
}

// Notification Types
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

// Message Types
export interface Message {
  id: number;
  conversation: number;
  sender: User;
  content: string;
  attachments: string[];
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  participants: User[];
  property?: number;
  booking?: number;
  last_message?: {
    id: number;
    content: string;
    sender: string;
    created_at: string;
  };
  unread_count: number;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  error: string;
  message?: string;
}
