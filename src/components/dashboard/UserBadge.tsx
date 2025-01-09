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
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  if (!user) {
    return null;
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
      <User className="h-4 w-4" />
      <div className="flex flex-col text-xs">
        <span>{profile?.name || user.email}</span>
        {profile?.name && <span className="text-muted-foreground">{user.email}</span>}
      </div>
    </Badge>
  );
};

export default UserBadge;