import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DocumentListItemProps {
  document: {
    id: string;
    filename: string;
    content_type: string;
    size: number;
    created_at: string;
    file_path: string;
  };
  formatFileSize: (size: number) => string;
  onDelete: (id: string) => void;
}

export const DocumentListItem = ({ document, formatFileSize, onDelete }: DocumentListItemProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = document.content_type.startsWith('image/');

  const handlePreview = async () => {
    try {
      console.log('Fetching document for preview:', document.file_path);
      const { data, error } = await supabase.storage
        .from('client_documents')
        .createSignedUrl(document.file_path, 3600); // URL valid for 1 hour

      if (error) {
        console.error('Preview error:', error);
        throw error;
      }

      if (isImage) {
        setPreviewUrl(data.signedUrl);
        setPreviewOpen(true);
      } else {
        // For non-image files, trigger download
        handleDownload();
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to preview document');
    }
  };

  const handleDownload = async () => {
    try {
      console.log('Downloading document:', document.file_path);
      const { data, error } = await supabase.storage
        .from('client_documents')
        .download(document.file_path);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      // Create a download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.filename;
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

  return (
    <>
      <div className="flex items-center justify-between p-2 border rounded-lg">
        <div className="flex-1 min-w-0">
          <button
            onClick={handlePreview}
            className="text-left hover:underline text-primary inline-flex items-center gap-2"
          >
            {isImage ? (
              <ImageIcon className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {document.filename}
          </button>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{formatFileSize(document.size)}</span>
            <span>•</span>
            <span>{format(new Date(document.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(document.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          {previewUrl && isImage && (
            <img 
              src={previewUrl} 
              alt={document.filename}
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};