import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { DeletionRequestsTable } from "./DeletionRequestsTable";
import { DeletionRequestsLoading } from "./DeletionRequestsLoading";
import { ClientDeletionRequest } from "@/types";

export const DeletionRequests = () => {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['deletionRequests'],
    queryFn: async () => {
      console.log('Fetching deletion requests...');
      const { data, error } = await supabase
        .from('client_deletion_requests')
        .select(`
          *,
          clients (name),
          profiles!client_deletion_requests_requested_by_profiles_fkey (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deletion requests:', error);
        throw error;
      }

      console.log('Deletion requests:', data);
      return data as (ClientDeletionRequest & {
        clients: { name: string } | null;
        profiles: { name: string } | null;
      })[];
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status, userId }: { id: string; status: 'approved' | 'rejected'; userId: string }) => {
      setProcessingId(id);
      
      const { error: updateError } = await supabase
        .from('client_deletion_requests')
        .update({ 
          status,
          reviewed_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      if (status === 'approved') {
        const request = requests?.find(r => r.id === id);
        if (request?.client_id) {
          const { error: deleteError } = await supabase
            .from('clients')
            .delete()
            .eq('id', request.client_id);

          if (deleteError) throw deleteError;
        }
      }
    },
    onSuccess: (_, variables) => {
      const action = variables.status === 'approved' ? 'approved' : 'rejected';
      toast.success(`Request ${action} successfully`);
      queryClient.invalidateQueries({ queryKey: ['deletionRequests'] });
    },
    onError: (error) => {
      console.error('Error updating request:', error);
      toast.error('Failed to process request');
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  if (isLoading) {
    return <DeletionRequestsLoading />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deletion Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Error loading deletion requests. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Deletion Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests && requests.length > 0 ? (
          <DeletionRequestsTable
            requests={requests}
            processingId={processingId}
            onUpdateRequest={(id, status, userId) => 
              updateRequestMutation.mutate({ id, status, userId })}
          />
        ) : (
          <Alert>
            <AlertDescription>
              No deletion requests found.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};