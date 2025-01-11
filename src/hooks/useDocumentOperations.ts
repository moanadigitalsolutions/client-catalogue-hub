import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { trackActivity } from "@/utils/activity";

export const useDocumentOperations = (clientId: string, onSuccess?: () => void) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const uploadDocument = async (file: File) => {
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
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadDocument
  };
};