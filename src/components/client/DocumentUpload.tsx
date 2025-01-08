import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentList } from "./DocumentList";
import { useAuth } from "@/contexts/AuthContext";

interface Document {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
}

export const DocumentUpload = ({ clientId }: { clientId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['clientDocuments', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', clientId);

      if (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to load documents');
        throw error;
      }

      return data as Document[];
    },
    enabled: !!clientId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');

      const timestamp = new Date().toISOString();
      const fileExt = file.name.split('.').pop();
      const filePath = `${clientId}/${timestamp}-${crypto.randomUUID()}.${fileExt}`;

      console.log('Uploading file to storage:', { filePath, fileType: file.type });
      const { error: uploadError } = await supabase.storage
        .from('client_documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully, saving metadata to database');
      const { error: dbError } = await supabase
        .from('client_documents')
        .insert({
          client_id: clientId,
          filename: file.name,
          file_path: filePath,
          content_type: file.type,
          size: file.size,
          uploaded_by: user.id, // Add the user ID here
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientDocuments', clientId] });
      toast.success('Document uploaded successfully');
      setFile(null);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="document">Upload Document</Label>
          <Input
            id="document"
            type="file"
            accept=".pdf,.xlsx,.xls,.doc,.docx,.jpeg,.jpg,.png"
            onChange={handleFileChange}
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={!file || uploadMutation.isPending}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      <DocumentList documents={documents} formatFileSize={formatFileSize} />
    </div>
  );
};