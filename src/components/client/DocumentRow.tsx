import { File } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { DocumentActions } from "./DocumentActions";

interface Document {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
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
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center">
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