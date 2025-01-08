export interface Document {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
  file_path: string;
}

export interface DocumentListProps {
  documents: Document[];
  formatFileSize: (bytes: number) => string;
}

export interface DocumentRowProps {
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

export interface DocumentActionsProps {
  documentId: string;
  status: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  setSelectedDocId: (id: string | null) => void;
  onDeleteRequest: (id: string) => void;
  isPending: boolean;
}