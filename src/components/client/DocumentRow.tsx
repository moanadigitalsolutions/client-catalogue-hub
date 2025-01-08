import { File } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { DocumentActions } from "./DocumentActions";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Document {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
  file_path: string;
}

interface DocumentRowProps {
  document: Document;
  status: string | null;
  formatFileSize: (bytes: number) => string;
  dialogOpen: boolean;
  selectedDocId: string | null;
  setDialogOpen: (open: boolean) => void;
  setSelectedDocId: (id: string | null) => void;
  onDeleteRequest: (id: string) => void;
  isPending: boolean;
}

export const DocumentRow = ({
  document,
  status,
  formatFileSize,
  dialogOpen,
  selectedDocId,
  setDialogOpen,
  setSelectedDocId,
  onDeleteRequest,
  isPending,
}: DocumentRowProps) => {
  const handleDocumentClick = async () => {
    try {
      console.log('Fetching document URL:', document.file_path);
      const { data, error } = await supabase.storage
        .from('client_documents')
        .createSignedUrl(document.file_path, 60); // URL valid for 60 seconds

      if (error) {
        console.error('Error creating signed URL:', error);
        toast.error('Failed to access document');
        return;
      }

      if (data?.signedUrl) {
        console.log('Opening document URL:', data.signedUrl);
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error handling document click:', error);
      toast.error('Failed to open document');
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div 
          className="flex items-center cursor-pointer hover:text-primary"
          onClick={handleDocumentClick}
          role="button"
          tabIndex={0}
        >
          <File className="h-4 w-4 mr-2" />
          {document.filename}
        </div>
      </TableCell>
      <TableCell>{document.content_type}</TableCell>
      <TableCell>{formatFileSize(document.size)}</TableCell>
      <TableCell>
        {new Date(document.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <DocumentActions
          documentId={document.id}
          status={status}
          dialogOpen={dialogOpen && selectedDocId === document.id}
          setDialogOpen={setDialogOpen}
          setSelectedDocId={setSelectedDocId}
          onDeleteRequest={onDeleteRequest}
          isPending={isPending}
        />
      </TableCell>
    </TableRow>
  );
};