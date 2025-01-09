import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const UserActivities = () => {
  const { user } = useAuth();
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ['user-activities'],
    queryFn: async () => {
      console.log('Fetching user activities...');
      
      const { data, error } = await supabase
        .from('user_activities')
        .select(`
          *,
          profiles:profiles(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      return data;
    },
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {activity.profiles?.name || 'Unknown User'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {activity.activity_type}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
          ))}
          {activities?.length === 0 && (
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