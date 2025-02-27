import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const UserActivities = () => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // First, check if user is admin
  const { data: userRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      console.log('Checking user role for activities view');
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }
      
      console.log('User role:', data?.role);
      return data?.role || null;
    },
    enabled: !!user?.id,
  });

  // Fetch activities based on user role
  const { data: activities, isLoading } = useQuery({
    queryKey: ['user-activities', user?.id, userRole, isExpanded],
    queryFn: async () => {
      console.log('Fetching user activities...', { userRole, userId: user?.id });
      
      let query = supabase
        .from('user_activities')
        .select(`
          *,
          profiles (name, email)
        `)
        .order('created_at', { ascending: false });

      // If not admin, only show user's own activities
      if (userRole !== 'admin') {
        query = query.eq('user_id', user?.id);
      }

      const { data, error } = await query.limit(isExpanded ? 50 : 10);

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      console.log('Fetched activities:', data);
      return data || [];
    },
    enabled: !!user?.id && !!userRole,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show anything if there's no user role yet
  if (!userRole) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {userRole === 'admin' ? 'All Recent Activities' : 'Your Recent Activities'}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className={isExpanded ? "h-[400px]" : "h-[200px]"}>
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {activity.profiles?.email || 'Unknown User'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {activity.activity_type}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4">
              No recent activities
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UserActivities;