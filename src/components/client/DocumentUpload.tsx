import { Input } from "@/components/ui/input";
import { DocumentList } from "./DocumentList";
import { formatFileSize } from "@/lib/utils";
import { useDocumentOperations } from "@/hooks/useDocumentOperations";

interface DocumentUploadProps {
  clientId: string;
}

export const DocumentUpload = ({ clientId }: DocumentUploadProps) => {
  const {
    documents,
    isLoading,
    isUploading,
    uploadMutation,
    deleteMutation
  } = useDocumentOperations(clientId);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
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

      <DocumentList
        documents={documents}
        formatFileSize={formatFileSize}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this document?')) {
            deleteMutation.mutate(id);
          }
        }}
      />
    </div>
  );
};