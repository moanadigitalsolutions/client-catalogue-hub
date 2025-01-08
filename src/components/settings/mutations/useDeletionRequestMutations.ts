import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useClientDeletionRequestMutation = (setProcessingId: (id: string | null) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
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
        const { data: request } = await supabase
          .from('client_deletion_requests')
          .select('client_id')
          .eq('id', id)
          .single();

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
};

export const useDocumentDeletionRequestMutation = (setProcessingId: (id: string | null) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
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
        const { data: request } = await supabase
          .from('document_deletion_requests')
          .select('document_id')
          .eq('id', id)
          .single();

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
};