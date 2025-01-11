import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { trackActivity } from "@/utils/activity";

export const useDocumentDeletion = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const deleteDocument = async (documentId: string, filePath: string) => {
    try {
      if (!user) throw new Error("User must be authenticated");
      
      setLoading(true);
      console.log('Deleting document:', documentId, filePath);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('client_documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      // Track the deletion activity
      await trackActivity('Deleted document');

      toast.success('Document deleted successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteDocument
  };
};