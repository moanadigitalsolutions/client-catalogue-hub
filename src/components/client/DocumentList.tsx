import { File, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  // Query to check existing deletion requests
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
      
      // Check if there's already a pending request for this document
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
          {documents.map((doc) => {
            const status = getDocumentStatus(doc.id);
            return (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2" />
                    {doc.filename}
                  </div>
                </TableCell>
                <TableCell>{doc.content_type}</TableCell>
                <TableCell>{formatFileSize(doc.size)}</TableCell>
                <TableCell>
                  {new Date(doc.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {status ? (
                    <span className="text-sm text-muted-foreground">
                      Deletion {status}
                    </span>
                  ) : (
                    <Dialog 
                      open={dialogOpen && selectedDocId === doc.id} 
                      onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) setSelectedDocId(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => setSelectedDocId(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Document Deletion</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p>
                            Are you sure you want to request deletion of this document?
                            An admin will review your request.
                          </p>
                          <Button
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(doc.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Request Deletion
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
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