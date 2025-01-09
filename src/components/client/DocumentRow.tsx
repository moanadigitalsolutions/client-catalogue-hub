import { TableCell, TableRow } from "@/components/ui/table";
import { DocumentActions } from "./DocumentActions";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import { DocumentRowProps } from "@/types/documents";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Image as ImageIcon } from "lucide-react";

export const DocumentRow = ({
  document: clientDocument,
  status,
  formatFileSize,
  dialogOpen,
  selectedDocId,
  setDialogOpen,
  setSelectedDocId,
  onDeleteRequest,
  isPending,
}: DocumentRowProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = clientDocument.content_type.startsWith('image/');

  const handlePreview = async () => {
    try {
      console.log('Fetching document for preview:', clientDocument.file_path);
      const { data, error } = await supabase.storage
        .from('client_documents')
        .createSignedUrl(clientDocument.file_path, 3600); // URL valid for 1 hour

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
      console.log('Downloading document:', clientDocument.file_path);
      const { data, error } = await supabase.storage
        .from('client_documents')
        .download(clientDocument.file_path);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      // Create a download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = clientDocument.filename;
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
      <TableRow key={clientDocument.id}>
        <TableCell className="font-medium">
          <button
            onClick={handlePreview}
            className="text-left hover:underline text-primary inline-flex items-center gap-2"
          >
            {isImage ? (
              <ImageIcon className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {clientDocument.filename}
          </button>
        </TableCell>
        <TableCell>{clientDocument.content_type}</TableCell>
        <TableCell>{formatFileSize(clientDocument.size)}</TableCell>
        <TableCell>{format(new Date(clientDocument.created_at), 'PP')}</TableCell>
        <TableCell>
          <DocumentActions
            documentId={clientDocument.id}
            status={status}
            dialogOpen={dialogOpen && selectedDocId === clientDocument.id}
            setDialogOpen={setDialogOpen}
            setSelectedDocId={setSelectedDocId}
            onDeleteRequest={onDeleteRequest}
            isPending={isPending}
          />
        </TableCell>
      </TableRow>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          {previewUrl && isImage && (
            <img 
              src={previewUrl} 
              alt={clientDocument.filename}
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};