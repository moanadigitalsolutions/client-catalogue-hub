import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const UserActivities = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['user-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading activities...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2">
              <span>{activity.activity_type}</span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UserActivities;