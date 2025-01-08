import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DocumentRow } from "./DocumentRow";

interface Document {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
}

interface DocumentListProps {
  documents: Document[];
  formatFileSize: (bytes: number) => string;
}

export const DocumentList = ({ documents, formatFileSize }: DocumentListProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const { data: existingRequests } = useQuery({
    queryKey: ['documentDeletionRequests', user?.id],
    queryFn: async () => {
      console.log('Checking existing deletion requests...');
      const { data, error } = await supabase
        .from('document_deletion_requests')
        .select('document_id, status')
        .eq('requested_by', user?.id);

      if (error) {
        console.error('Error fetching existing requests:', error);
        throw error;
      }

      console.log('Existing deletion requests:', data);
      return data || [];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      if (!user) throw new Error('User must be authenticated to request deletion');
      
      const existingRequest = existingRequests?.find(
        req => req.document_id === documentId && req.status === 'pending'
      );

      if (existingRequest) {
        throw new Error('A deletion request for this document is already pending');
      }
      
      console.log('Requesting document deletion:', { documentId, userId: user.id });
      
      const { error } = await supabase
        .from('document_deletion_requests')
        .insert({
          document_id: documentId,
          requested_by: user.id,
          reason: 'Document no longer needed',
        });

      if (error) {
        console.error('Delete request error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Deletion request submitted');
      queryClient.invalidateQueries({ queryKey: ['clientDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['documentDeletionRequests'] });
      setDialogOpen(false);
      setSelectedDocId(null);
    },
    onError: (error) => {
      console.error('Delete request error:', error);
      if (error instanceof Error && error.message.includes('already pending')) {
        toast.error('A deletion request for this document is already pending');
      } else {
        toast.error('Failed to request document deletion');
      }
    },
  });

  const getDocumentStatus = (docId: string) => {
    const request = existingRequests?.find(req => req.document_id === docId);
    return request?.status || null;
  };

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
          {documents.map((doc) => (
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
          {documents.length === 0 && (
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