import { createContext, useContext, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("AuthContext: Attempting sign in with email:", email);
      
      // Simple login check
      if (email === "admin@temp.com" && password === "admin123") {
        console.log("AuthContext: Login successful");
        const mockUser = {
          id: 'temp-admin',
          email: 'admin@temp.com',
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          role: 'authenticated',
        } as User;
        
        setUser(mockUser);
        toast.success("Logged in successfully");
        navigate('/dashboard');
        return;
      }
      
      // If credentials don't match, show error
      console.error("AuthContext: Invalid credentials");
      toast.error("Invalid email or password");
      
    } catch (error) {
      console.error("AuthContext: Sign in error:", error);
      toast.error("An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
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