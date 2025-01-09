import { TableCell, TableRow } from "@/components/ui/table";
import { DocumentActions } from "./DocumentActions";
import { FileText, Image as ImageIcon } from "lucide-react";
import { DocumentRowProps } from "@/types/documents";
import { useDocumentPreview } from "@/hooks/useDocumentPreview";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";

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
  const {
    previewOpen,
    setPreviewOpen,
    previewUrl,
    handlePreview
  } = useDocumentPreview();

  const isImage = clientDocument.content_type.startsWith('image/');

  return (
    <>
      <TableRow key={clientDocument.id}>
        <TableCell className="font-medium">
          <button
            onClick={() => handlePreview(
              clientDocument.file_path,
              isImage,
              clientDocument.filename
            )}
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

      <DocumentPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        previewUrl={previewUrl}
        filename={clientDocument.filename}
      />
    </>
  );
};