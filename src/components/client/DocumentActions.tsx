import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DocumentDeletionDialog } from "./DocumentDeletionDialog";

interface DocumentActionsProps {
  documentId: string;
  status: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  setSelectedDocId: (id: string | null) => void;
  onDeleteRequest: (id: string) => void;
  isPending: boolean;
}

export const DocumentActions = ({
  documentId,
  status,
  dialogOpen,
  setDialogOpen,
  setSelectedDocId,
  onDeleteRequest,
  isPending,
}: DocumentActionsProps) => {
  if (status) {
    return (
      <span className="text-sm text-muted-foreground">
        Deletion {status}
      </span>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive"
        onClick={() => setSelectedDocId(documentId)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <DocumentDeletionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedDocId(null);
        }}
        onConfirm={() => onDeleteRequest(documentId)}
        isPending={isPending}
      />
    </>
  );
};