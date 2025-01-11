import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const UserBadge = () => {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      console.log('Fetching user profile for:', user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Fetched profile:', data);
      return data;
    },
    enabled: !!user?.id,
    retry: false
  });

  const { data: userRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      console.log('Fetching user role for:', user?.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }
      
      console.log('Fetched user role:', data);
      return data;
    },
    enabled: !!user?.id,
    retry: false
  });

  if (!user) {
    return null;
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
      <User className="h-4 w-4" />
      <div className="flex flex-col text-xs">
        <span className="font-medium">{profile?.name || user.email}</span>
        {profile?.name && <span className="text-muted-foreground">{user.email}</span>}
        {userRole?.role && (
          <span className="text-xs text-muted-foreground capitalize">
            {userRole.role}
          </span>
        )}
      </div>
    </Badge>
  );
};

export default UserBadge;