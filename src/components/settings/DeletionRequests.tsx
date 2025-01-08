import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { DeletionRequestsTable } from "./DeletionRequestsTable";
import { DeletionRequestsLoading } from "./DeletionRequestsLoading";
import { ClientDeletionRequest } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DeletionRequests = () => {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: clientRequests, isLoading: isLoadingClientRequests, error: clientError } = useQuery({
    queryKey: ['clientDeletionRequests'],
    queryFn: async () => {
      console.log('Fetching client deletion requests...');
      const { data, error } = await supabase
        .from('client_deletion_requests')
        .select(`
          *,
          clients (name),
          profiles!client_deletion_requests_requested_by_profiles_fkey (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching client deletion requests:', error);
        throw error;
      }

      console.log('Client deletion requests:', data);
      return data as (ClientDeletionRequest & {
        clients: { name: string } | null;
        profiles: { name: string } | null;
      })[];
    },
  });

  const { data: documentRequests, isLoading: isLoadingDocRequests, error: docError } = useQuery({
    queryKey: ['documentDeletionRequests'],
    queryFn: async () => {
      console.log('Fetching document deletion requests...');
      const { data, error } = await supabase
        .from('document_deletion_requests')
        .select(`
          *,
          client_documents!inner (
            filename,
            client_id
          ),
          client_documents!inner.clients!inner (
            name
          ),
          profiles!inner (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching document deletion requests:', error);
        throw error;
      }

      console.log('Document deletion requests:', data);
      return data;
    },
  });

  const updateClientRequestMutation = useMutation({
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
        const request = clientRequests?.find(r => r.id === id);
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
      toast.success(`Client deletion request ${action} successfully`);
      queryClient.invalidateQueries({ queryKey: ['clientDeletionRequests'] });
    },
    onError: (error) => {
      console.error('Error updating client request:', error);
      toast.error('Failed to process client deletion request');
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  const updateDocRequestMutation = useMutation({
    mutationFn: async ({ id, status, userId }: { id: string; status: 'approved' | 'rejected'; userId: string }) => {
      setProcessingId(id);
      
      const { error: updateError } = await supabase
        .from('document_deletion_requests')
        .update({ 
          status,
          reviewed_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      if (status === 'approved') {
        const request = documentRequests?.find(r => r.id === id);
        if (request?.document_id) {
          const { error: deleteError } = await supabase
            .from('client_documents')
            .delete()
            .eq('id', request.document_id);

          if (deleteError) throw deleteError;
        }
      }
    },
    onSuccess: (_, variables) => {
      const action = variables.status === 'approved' ? 'approved' : 'rejected';
      toast.success(`Document deletion request ${action} successfully`);
      queryClient.invalidateQueries({ queryKey: ['documentDeletionRequests'] });
    },
    onError: (error) => {
      console.error('Error updating document request:', error);
      toast.error('Failed to process document deletion request');
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  if (isLoadingClientRequests || isLoadingDocRequests) {
    return <DeletionRequestsLoading />;
  }

  if (clientError || docError) {
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
        <CardTitle>Deletion Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="clients">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clients">Client Requests</TabsTrigger>
            <TabsTrigger value="documents">Document Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients">
            {clientRequests && clientRequests.length > 0 ? (
              <DeletionRequestsTable
                requests={clientRequests}
                processingId={processingId}
                onUpdateRequest={(id, status, userId) => 
                  updateClientRequestMutation.mutate({ id, status, userId })}
              />
            ) : (
              <Alert>
                <AlertDescription>
                  No client deletion requests found.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="documents">
            {documentRequests && documentRequests.length > 0 ? (
              <DeletionRequestsTable
                requests={documentRequests.map(req => ({
                  ...req,
                  clients: { name: req.client_documents.clients.name },
                  profiles: { name: req.profiles.name }
                }))}
                processingId={processingId}
                onUpdateRequest={(id, status, userId) => 
                  updateDocRequestMutation.mutate({ id, status, userId })}
              />
            ) : (
              <Alert>
                <AlertDescription>
                  No document deletion requests found.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};