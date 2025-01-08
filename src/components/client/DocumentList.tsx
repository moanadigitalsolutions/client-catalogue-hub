import { File, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      if (!user) throw new Error('User must be authenticated to request deletion');
      
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
      setDialogOpen(false); // Close the dialog on success
      setSelectedDocId(null); // Reset selected document
    },
    onError: (error) => {
      console.error('Delete request error:', error);
      toast.error('Failed to request document deletion');
    },
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
          {documents.map((doc) => (
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
                <Dialog open={dialogOpen && selectedDocId === doc.id} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) setSelectedDocId(null);
                }}>
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
              </TableCell>
            </TableRow>
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