import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
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

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // If we have a user and we're on the login page, redirect to dashboard
        if (location.pathname === '/login') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("AuthContext: Attempting sign in with email:", email);
      
      // First try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log("Supabase auth failed, trying temp admin:", error.message);
        // If Supabase auth fails, try temp admin login
        if (email === "admin@temp.com" && password === "admin123") {
          console.log("AuthContext: Temp admin login successful");
          const mockUser = {
            id: 'temp-admin',
            email: 'admin@temp.com',
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            role: 'authenticated',
          } as User;
          
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          toast.success("Logged in successfully as temp admin");
          
          const from = location.state?.from?.pathname || '/dashboard';
          console.log("AuthContext: Redirecting to:", from);
          navigate(from, { replace: true });
          return;
        }
        throw error;
      }

      if (data.user) {
        console.log("AuthContext: Supabase login successful");
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success("Logged in successfully");
        
        const from = location.state?.from?.pathname || '/dashboard';
        console.log("AuthContext: Redirecting to:", from);
        navigate(from, { replace: true });
        return;
      }
      
    } catch (error) {
      console.error("AuthContext: Sign in error:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      localStorage.removeItem('user');
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