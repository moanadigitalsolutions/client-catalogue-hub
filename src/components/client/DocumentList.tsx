import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentRow } from "./DocumentRow";
import { useDocumentDeletion } from "@/hooks/useDocumentDeletion";
import { Document, DocumentListProps } from "@/types/documents";

export const DocumentList = ({ documents, formatFileSize }: DocumentListProps) => {
  const {
    dialogOpen,
    setDialogOpen,
    selectedDocId,
    setSelectedDocId,
    deleteMutation,
    getDocumentStatus,
    existingRequests,
  } = useDocumentDeletion();

  // Filter out documents that have approved deletion requests
  const filteredDocuments = documents.filter(doc => {
    const deletionRequest = existingRequests?.find(req => req.document_id === doc.id);
    return !deletionRequest || deletionRequest.status !== 'approved';
  });

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              status={getDocumentStatus(doc.id)}
              formatFileSize={formatFileSize}
              dialogOpen={dialogOpen}
              selectedDocId={selectedDocId}
              setDialogOpen={setDialogOpen}
              setSelectedDocId={setSelectedDocId}
              onDeleteRequest={(id) => deleteMutation.mutate(id)}
              isPending={deleteMutation.isPending}
            />
          ))}
          {filteredDocuments.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No documents uploaded yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};