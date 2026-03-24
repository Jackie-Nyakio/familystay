import { useEffect, useState, useRef, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes warning
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimeouts = useCallback(() => {
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
  }, []);

  const doLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    clearAllTimeouts();
    setShowTimeoutWarning(false);
    setIsAuthenticated(false);
    router.push('/auth/login?message=session_expired');
  }, [router, clearAllTimeouts]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setShowTimeoutWarning(false);
    setIsAuthenticated(false);
    router.push('/auth/login');
  }, [router]);

  const handleStayLoggedIn = useCallback(() => {
    setShowTimeoutWarning(false);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    // Reset timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    
    timeoutRef.current = setTimeout(doLogout, INACTIVITY_TIMEOUT);
    
    warningRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
      let timeLeft = WARNING_BEFORE_TIMEOUT;
      setRemainingTime(timeLeft);
      
      countdownRef.current = setInterval(() => {
        timeLeft -= 1000;
        setRemainingTime(timeLeft);
        
        if (timeLeft <= 0 && countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT);
  }, [doLogout, INACTIVITY_TIMEOUT, WARNING_BEFORE_TIMEOUT]);

  const refreshActivity = useCallback(() => {
    if (!isAuthenticated) return;
    
    setShowTimeoutWarning(false);
    clearAllTimeouts();

    timeoutRef.current = setTimeout(doLogout, INACTIVITY_TIMEOUT);

    warningRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
      let timeLeft = WARNING_BEFORE_TIMEOUT;
      setRemainingTime(timeLeft);
      
      countdownRef.current = setInterval(() => {
        timeLeft -= 1000;
        setRemainingTime(timeLeft);
        
        if (timeLeft <= 0 && countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT);
  }, [isAuthenticated, clearAllTimeouts, doLogout, INACTIVITY_TIMEOUT, WARNING_BEFORE_TIMEOUT]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    
    if (!token) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    const handleActivity = () => {
      if (!showTimeoutWarning) {
        refreshActivity();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    refreshActivity();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearAllTimeouts();
    };
  }, [refreshActivity, clearAllTimeouts, showTimeoutWarning]);

  const formatTime = (ms: number) => {
    if (ms < 0) return "0:00";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {children}
      {isAuthenticated && showTimeoutWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Session Expiring</h3>
            <p className="text-gray-600 mb-4">
              Your session will expire in <span className="font-bold text-blue-600">{formatTime(remainingTime)}</span> due to inactivity.
            </p>
            <p className="text-gray-600 mb-4">
              Would you like to stay logged in?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                Log Out
              </button>
              <button
                onClick={handleStayLoggedIn}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}