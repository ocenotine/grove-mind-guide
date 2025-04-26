
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, options?: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
  
  setSession: (session) => {
    set({ 
      session, 
      user: session?.user || null,
      isAuthenticated: !!session?.user
    });
  },
  
  setLoading: (loading) => {
    set({ loading });
  },
  
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    set({ 
      user: data.user, 
      session: data.session,
      isAuthenticated: true 
    });
  },
  
  signup: async (email, password, name, options = {}) => {
    let userData = {
      name
    };
    
    if (options.accountType === 'institution') {
      userData = {
        ...userData,
        accountType: options.accountType,
        institutionName: options.institutionName,
        domain: options.domain
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      set({ 
        user: data.user, 
        session: data.session,
        isAuthenticated: !!data.session
      });
    }
  },
  
  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      // First clear the store state
      set({ 
        user: null, 
        session: null, 
        isAuthenticated: false 
      });
      
      // Then tell Supabase to sign out
      const { error } = await supabase.auth.signOut({ 
        scope: 'local' // Use 'global' to sign out from all devices
      });
      
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      
      // Clear any local auth data
      localStorage.removeItem('supabase.auth.token');
      
      // Return successful
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      return Promise.reject(error);
    }
  }
}));

// Set up auth listener
export const initializeAuth = async () => {
  const { setUser, setSession, setLoading } = useAuthStore.getState();
  
  try {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    // Then check for any existing session
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
    
    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error("Auth initialization error:", error);
    setLoading(false);
  }
};
