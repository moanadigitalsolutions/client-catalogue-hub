import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Document } from "@/types/documents";

export const useDocumentOperations = (clientId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['client-documents', clientId],
    queryFn: async () => {
      if (!user) throw new Error('Authentication required');

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
      console.log('Fetched documents:', data);
      return data as Document[];
    },
    enabled: !!user, // Only run query if user is authenticated
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) {
        throw new Error('User must be logged in to upload documents');
      }

      console.log('Starting file upload:', file.name);
      setIsUploading(true);

      const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
      const timestamp = Date.now();
      const filePath = `clients/${clientId}/${timestamp}-${sanitizedFileName}`;

      console.log('Uploading to storage with path:', filePath);
      const { error: uploadError } = await supabase.storage
        .from('client_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully, saving to database');
      const { error: dbError } = await supabase
        .from('client_documents')
        .insert({
          client_id: clientId,
          filename: sanitizedFileName,
          content_type: file.type,
          size: file.size,
          file_path: filePath,
          uploaded_by: user.id,
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        // If database insert fails, clean up the uploaded file
        await supabase.storage
          .from('client_documents')
          .remove([filePath]);
        throw dbError;
      }

      await supabase.from('client_activities').insert({
        client_id: clientId,
        activity_type: 'document_added',
        description: `Document "${sanitizedFileName}" was uploaded`,
        user_id: user.id,
      });
    },
    onSuccess: () => {
      console.log('Upload completed successfully');
      queryClient.invalidateQueries({ queryKey: ['client-documents'] });
      toast.success('Document uploaded successfully');
      setIsUploading(false);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      if (!user) {
        throw new Error('User must be logged in to delete documents');
      }

      console.log('Starting document deletion:', documentId);
      const document = documents?.find(d => d.id === documentId);
      if (!document) throw new Error('Document not found');

      console.log('Deleting from storage:', document.file_path);
      const { error: storageError } = await supabase.storage
        .from('client_documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        throw storageError;
      }

      console.log('Deleting from database');
      const { error: dbError } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        throw dbError;
      }

      await supabase.from('client_activities').insert({
        client_id: clientId,
        activity_type: 'document_removed',
        description: `Document "${document.filename}" was removed`,
        user_id: user.id,
      });
    },
    onSuccess: () => {
      console.log('Deletion completed successfully');
      queryClient.invalidateQueries({ queryKey: ['client-documents'] });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    },
  });

  return {
    documents,
    isLoading,
    isUploading,
    uploadMutation,
    deleteMutation
  };
};