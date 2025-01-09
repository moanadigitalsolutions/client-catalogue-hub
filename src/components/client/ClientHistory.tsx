import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, User, Clock, AlertCircle } from "lucide-react";

interface ClientHistoryProps {
  clientId: string;
}

interface ClientActivity {
  id: string;
  activity_type: string;
  description: string | null;
  created_at: string;
  profiles: {
    name: string | null;
  };
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'document_added':
    case 'document_removed':
      return <FileText className="h-4 w-4" />;
    case 'created':
    case 'updated':
      return <User className="h-4 w-4" />;
    case 'note_added':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'document_added':
      return 'text-green-500';
    case 'document_removed':
      return 'text-red-500';
    case 'created':
      return 'text-blue-500';
    case 'updated':
      return 'text-yellow-500';
    case 'note_added':
      return 'text-purple-500';
    default:
      return 'text-gray-500';
  }
};

export const ClientHistory = ({ clientId }: ClientHistoryProps) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['client-activities', clientId],
    queryFn: async () => {
      console.log('Fetching client activities for:', clientId);
      const { data, error } = await supabase
        .from('client_activities')
        .select(`
          *,
          profiles (name)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching client activities:', error);
        throw error;
      }

      console.log('Fetched client activities:', data);
      return data as ClientActivity[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <ScrollArea className="h-[400px] pr-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Activity items */}
            <div className="space-y-6">
              {activities?.map((activity) => (
                <div key={activity.id} className="relative flex items-start gap-4 ml-8">
                  {/* Timeline dot */}
                  <div className={`absolute -left-10 mt-1 p-1 rounded-full bg-white ring-2 ${getActivityColor(activity.activity_type)} ring-offset-2`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>

                  {/* Activity content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {activity.profiles?.name || 'Unknown User'}
                      </p>
                      <time className="text-sm text-muted-foreground">
                        {format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activity.description || activity.activity_type.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              ))}

              {(!activities || activities.length === 0) && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No activity history available
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};