import React, { createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  // Convert Clerk user to our User interface
  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    isActive: true,
    lastLogin: clerkUser.lastSignInAt?.toISOString(),
    createdAt: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
  } : null;

  const isAuthenticated = !!user;
  const isLoading = !isLoaded;

  const login = async (email: string, password: string) => {
    // Clerk handles login through their components
    toast.info('Please use the sign-in form below');
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    // Clerk handles registration through their components
    toast.info('Please use the sign-up form below');
  };

  const logout = async () => {
    try {
      await signOut();
      localStorage.removeItem('leadMagnetPopupSeen');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const updateProfile = async (profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => {
    // Clerk handles profile updates through their components
    toast.info('Please use Clerk\'s profile management');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

