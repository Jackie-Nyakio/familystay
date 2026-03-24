/**
 * Format currency amount
 * @param amount - Amount to format
 * @param currency - Currency code (default: KES)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'KES'): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date
 * @param date - Date string or Date object
 * @param format - Format option (short, medium, long)
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const d = new Date(date);
  
  let options: Intl.DateTimeFormatOptions;
  if (format === 'short') {
    options = { month: 'short', day: 'numeric' };
  } else if (format === 'medium') {
    options = { month: 'short', day: 'numeric', year: 'numeric' };
  } else {
    options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  }
  
  return d.toLocaleDateString('en-KE', options);
};

/**
 * Format phone number to Kenyan format
 * @param phone - Phone number
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.startsWith('254')) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  } else if (digits.startsWith('0')) {
    return `+254 ${digits.slice(1, 4)} ${digits.slice(4)}`;
  }
  
  return phone;
};

/**
 * Format number with commas
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-KE').format(num);
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return formatDate(date, 'medium');
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};
