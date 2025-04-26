
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PageTransition } from '@/components/animations/PageTransition';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    loading: state.loading
  }));
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          navigate('/dashboard');
        } else {
          navigate('/landing');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate('/landing');
      }
    };
    
    if (!loading) {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/landing');
      }
    } else {
      checkAuth();
    }
  }, [isAuthenticated, loading, navigate]);
  
  return (
    <PageTransition>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse">
          <p className="text-xl font-medium text-foreground">Redirecting...</p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
