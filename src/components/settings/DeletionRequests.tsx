import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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

      // If approved, delete the client
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deletion Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.clients?.name || 'Unknown Client'}</TableCell>
                    <TableCell>{request.profiles?.name || 'Unknown User'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                    <TableCell>{format(new Date(request.created_at), 'PPp')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === 'approved'
                            ? 'success'
                            : request.status === 'rejected'
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateRequestMutation.mutate({
                              id: request.id,
                              status: 'approved',
                              userId: request.requested_by,
                            })}
                            disabled={!!processingId}
                          >
                            {processingId === request.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRequestMutation.mutate({
                              id: request.id,
                              status: 'rejected',
                              userId: request.requested_by,
                            })}
                            disabled={!!processingId}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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