import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityTracking } from '@/hooks/useActivityTracking';

export const AuthActivityTracker = () => {
  const { user, isAuthenticated } = useAuth();
  const { trackLogin, trackLogout, trackRegister } = useActivityTracking();

  // Track auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // User just logged in - track the login
      trackLogin();
    }
  }, [isAuthenticated, user, trackLogin]);

  // This component doesn't render anything, it just tracks auth events
  return null;
};
