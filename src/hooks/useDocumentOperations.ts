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

  // Query for fetching documents
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

  // Upload mutation
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

        const { error: dbError } = await supabase
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
          ]);

        if (dbError) throw dbError;

        // Track the upload activity
        await trackActivity('Uploaded document');
        
        toast.success('Document uploaded successfully');
        onSuccess?.();
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
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', clientId] });
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