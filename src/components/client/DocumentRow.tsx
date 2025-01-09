import { TableCell, TableRow } from "@/components/ui/table";
import { DocumentActions } from "./DocumentActions";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import { DocumentRowProps } from "@/types/documents";

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
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('client_documents')
        .download(clientDocument.file_path);

      if (error) {
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
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  return (
    <TableRow key={clientDocument.id}>
      <TableCell className="font-medium">
        <button
          onClick={handleDownload}
          className="text-left hover:underline text-primary"
        >
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
  );
};