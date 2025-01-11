import { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check active session and handle initial auth state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id);
        
        if (error) {
          console.error('Session check error:', error);
          throw error;
        }
        
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast.error('Authentication error. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        navigate('/dashboard');
        toast.success('Signed in successfully');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
        toast.success('Signed out successfully');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        setUser(session?.user ?? null);
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("AuthContext: Attempting sign in with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("AuthContext: Sign in error:", error);
        throw error;
      }

      if (data.user) {
        console.log("AuthContext: Login successful");
        setUser(data.user);
        
        const from = location.state?.from?.pathname || '/dashboard';
        console.log("AuthContext: Redirecting to:", from);
        navigate(from, { replace: true });
        toast.success("Logged in successfully");
      }
      
    } catch (error) {
      console.error("AuthContext: Sign in error:", error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("AuthContext: Sign out error:", error);
      toast.error("An error occurred during sign out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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