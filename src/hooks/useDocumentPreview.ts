import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useDocumentPreview = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePreview = async (filePath: string, isImage: boolean, filename: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to preview documents');
        return;
      }

      console.log('Fetching document for preview:', filePath);
      const { data, error } = await supabase.storage
        .from('client_documents')
        .createSignedUrl(filePath, 3600);

      if (error) {
        console.error('Preview error:', error);
        throw error;
      }

      if (isImage) {
        setPreviewUrl(data.signedUrl);
        setPreviewOpen(true);
      } else {
        handleDownload(filePath, filename);
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to preview document');
    }
  };

  const handleDownload = async (filePath: string, filename: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to download documents');
        return;
      }

      console.log('Downloading document:', filePath);
      const { data, error } = await supabase.storage
        .from('client_documents')
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  return {
    previewOpen,
    setPreviewOpen,
    previewUrl,
    handlePreview,
    handleDownload
  };
};