import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentListItem } from "./DocumentListItem";

interface Document {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
  file_path: string;
}

interface DocumentListProps {
  documents: Document[] | null;
  formatFileSize: (size: number) => string;
  onDelete: (id: string) => void;
}

export const DocumentList = ({ documents, formatFileSize, onDelete }: DocumentListProps) => {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2">
        {documents?.map((doc) => (
          <DocumentListItem
            key={doc.id}
            document={doc}
            formatFileSize={formatFileSize}
            onDelete={onDelete}
          />
        ))}
        {(!documents || documents.length === 0) && (
          <p className="text-center text-sm text-muted-foreground py-4">
            No documents uploaded yet
          </p>
        )}
      </div>
    </ScrollArea>
  );
};