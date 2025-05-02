
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, AuthState } from '@/types/user';

// Create a context
const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  resetPassword: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock user for development
  const mockUser: UserProfile = {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar_url: "https://avatars.githubusercontent.com/u/1234567",
    account_type: "student",
    bio: "Student at Tek Talent University",
    document_count: 15,
    flashcard_count: 42,
    streak_count: 7,
    study_hours: 25,
  };

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // For development, we'll use the mock user
        setUser(mockUser);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock login
      setUser(mockUser);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // Mock registration
      const newUser = { ...mockUser, email, name };
      setUser(newUser);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Registration failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Mock logout
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    try {
      setLoading(true);
      // Mock profile update
      setUser(prevUser => prevUser ? { ...prevUser, ...profile } : null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Profile update failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      // Mock password reset
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Password reset failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
