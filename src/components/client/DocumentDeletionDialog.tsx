import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentDeletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export const DocumentDeletionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DocumentDeletionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onConfirm}
            disabled={isPending}
          >
            Request Deletion
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};