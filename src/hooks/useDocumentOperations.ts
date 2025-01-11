import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { trackActivity } from "@/utils/activity";
import { Document } from "@/types/documents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDocumentOperations = (clientId: string, onSuccess?: () => void) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', clientId],
    queryFn: async () => {
      console.log('Fetching documents for client:', clientId);
      const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }

      return data as Document[];
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        setUploading(true);
        if (!user) throw new Error("User must be authenticated");

        console.log('Uploading document:', file.name);
        
        const fileExt = file.name.split('.').pop();
        const filePath = `${clientId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('client_documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: document, error: dbError } = await supabase
          .from('client_documents')
          .insert([
            {
              client_id: clientId,
              filename: file.name,
              file_path: filePath,
              content_type: file.type,
              size: file.size,
              uploaded_by: user.id
            }
          ])
          .select()
          .single();

        if (dbError) throw dbError;

        // Track document upload in client activities
        await supabase.from('client_activities').insert({
          client_id: clientId,
          user_id: user.id,
          activity_type: 'document_added',
          description: `Document uploaded: ${file.name}`
        });

        await trackActivity('Uploaded document');
        
        toast.success('Document uploaded successfully');
        onSuccess?.();
        
        return document;
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload document');
        throw error;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', clientId] });
      queryClient.invalidateQueries({ queryKey: ['client-activities'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      if (!user) throw new Error("User must be authenticated");

      // Get document details before deletion
      const { data: document, error: fetchError } = await supabase
        .from('client_documents')
        .select('filename')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      // Track document deletion in client activities
      await supabase.from('client_activities').insert({
        client_id: clientId,
        user_id: user.id,
        activity_type: 'document_removed',
        description: `Document removed: ${document.filename}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', clientId] });
      queryClient.invalidateQueries({ queryKey: ['client-activities'] });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  });

  return {
    documents,
    isLoading,
    isUploading: uploading,
    uploadMutation,
    deleteMutation,
    uploadDocument: uploadMutation.mutate
  };
};