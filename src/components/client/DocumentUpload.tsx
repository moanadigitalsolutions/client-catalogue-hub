import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatFileSize } from "@/lib/utils";
import { format } from "date-fns";

interface Document {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
  file_path: string;
}

export const DocumentUpload = ({ clientId }: { clientId: string }) => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['client-documents', clientId],
    queryFn: async () => {
      console.log('Fetching documents for client:', clientId);
      const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
      console.log('Fetched documents:', data);
      return data as Document[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Starting file upload:', file.name);
      setIsUploading(true);
      const filename = `${Date.now()}-${file.name}`;
      const filePath = `clients/${clientId}/${filename}`;

      console.log('Uploading to storage with path:', filePath);
      const { error: uploadError } = await supabase.storage
        .from('client_documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully, saving to database');
      const { error: dbError } = await supabase
        .from('client_documents')
        .insert({
          client_id: clientId,
          filename: file.name,
          content_type: file.type,
          size: file.size,
          file_path: filePath,
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      // Record the activity
      await supabase.from('client_activities').insert({
        client_id: clientId,
        activity_type: 'document_added',
        description: `Document "${file.name}" was uploaded`
      });
    },
    onSuccess: () => {
      console.log('Upload completed successfully');
      queryClient.invalidateQueries({ queryKey: ['client-documents'] });
      toast.success('Document uploaded successfully');
      setIsUploading(false);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      console.log('Starting document deletion:', documentId);
      const document = documents?.find(d => d.id === documentId);
      if (!document) throw new Error('Document not found');

      console.log('Deleting from storage:', document.file_path);
      const { error: storageError } = await supabase.storage
        .from('client_documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        throw storageError;
      }

      console.log('Deleting from database');
      const { error: dbError } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        throw dbError;
      }

      // Record the activity
      await supabase.from('client_activities').insert({
        client_id: clientId,
        activity_type: 'document_removed',
        description: `Document "${document.filename}" was removed`
      });
    },
    onSuccess: () => {
      console.log('Deletion completed successfully');
      queryClient.invalidateQueries({ queryKey: ['client-documents'] });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleDelete = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(documentId);
    }
  };

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className="max-w-sm"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Upload client-related documents here
        </p>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {documents?.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.filename}</p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{format(new Date(doc.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {(!documents || documents.length === 0) && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No documents uploaded yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};