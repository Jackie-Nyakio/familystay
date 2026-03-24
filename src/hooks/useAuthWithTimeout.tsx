import { useState, useEffect, useCallback, useRef } from 'react';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/router';

// Configuration
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // Show warning 5 minutes before logout
const ACTIVITY_DEBOUNCE = 1000; // Debounce activity events

interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

interface UseAuthWithTimeoutReturn {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  showTimeoutWarning: boolean;
  remainingTime: number;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshActivity: () => void;
  stayLoggedIn: () => void;
}

export function useAuthWithTimeout(): UseAuthWithTimeoutReturn {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const activityDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (activityDebounceRef.current) {
      clearTimeout(activityDebounceRef.current);
      activityDebounceRef.current = null;
    }
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = useCallback((message = 'session_expired') => {
    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);
    setIsAuthenticated(false);
    setShowTimeoutWarning(false);
    
    // Clear timers
    clearAllTimers();
    
    // Redirect to login
    router.push(`/auth/login?message=${message}`);
  }, [router, clearAllTimers]);

  // Reset activity timers
  const refreshActivity = useCallback(() => {
    if (!isAuthenticated) return;
    
    lastActivityRef.current = Date.now();
    setShowTimeoutWarning(false);
    
    clearAllTimers();

    // Set inactivity timeout
    timeoutRef.current = setTimeout(() => {
      logout('inactivity_timeout');
    }, INACTIVITY_TIMEOUT);

    // Set warning timer
    warningRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
      let timeLeft = WARNING_BEFORE_TIMEOUT;
      setRemainingTime(timeLeft);
      
      countdownRef.current = setInterval(() => {
        timeLeft -= 1000;
        setRemainingTime(Math.max(0, timeLeft));
        
        if (timeLeft <= 0 && countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT);
  }, [isAuthenticated, clearAllTimers, logout]);

  // Stay logged in (extend session)
  const stayLoggedIn = useCallback(() => {
    refreshActivity();
  }, [refreshActivity]);

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    const handleActivity = () => {
      if (showTimeoutWarning) return; // Don't auto-refresh when warning is showing
      
      // Debounce activity events
      if (activityDebounceRef.current) {
        clearTimeout(activityDebounceRef.current);
      }
      
      activityDebounceRef.current = setTimeout(() => {
        refreshActivity();
      }, ACTIVITY_DEBOUNCE);
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    refreshActivity();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearAllTimers();
    };
  }, [isAuthenticated, showTimeoutWarning, refreshActivity, clearAllTimers]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({ username, password });
      const { user: userData, tokens } = response.data;
      
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      refreshActivity();
    } catch (error: any) {
      // Clean up on error
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    showTimeoutWarning,
    remainingTime,
    login,
    logout: () => logout('user_logout'),
    refreshActivity,
    stayLoggedIn,
  };
}

// Timeout warning modal component - with proper React import
export function TimeoutWarningModal({ 
  show, 
  remainingTime, 
  onStayLoggedIn, 
  onLogout 
}: { 
  show: boolean; 
  remainingTime: number; 
  onStayLoggedIn: () => void; 
  onLogout: () => void 
}) {
  if (!show) return null;

  const formatTime = (ms: number) => {
    if (ms < 0) return "0:00";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-2">Session Expiring</h3>
        <p className="text-gray-600 mb-4">
          Your session will expire in <span className="font-bold text-primary-500">{formatTime(remainingTime)}</span> due to inactivity.
        </p>
        <p className="text-gray-600 mb-4">
          Would you like to stay logged in?
        </p>
        <div className="flex gap-2">
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Log Out
          </button>
          <button
            onClick={onStayLoggedIn}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}

export default useAuthWithTimeout;