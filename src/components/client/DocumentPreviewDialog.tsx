import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string | null;
  filename: string;
}

export const DocumentPreviewDialog = ({
  open,
  onOpenChange,
  previewUrl,
  filename,
}: DocumentPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        {previewUrl && (
          <img 
            src={previewUrl} 
            alt={filename}
            className="w-full h-auto rounded-lg"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};