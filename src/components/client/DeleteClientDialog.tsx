import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";

interface DeleteClientDialogProps {
  clientId: string;
  clientName: string;
  onRequestSent: () => void;
}

export const DeleteClientDialog = ({
  clientId,
  clientName,
  onRequestSent,
}: DeleteClientDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for deletion");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("client_deletion_requests")
        .insert([
          {
            client_id: clientId,
            requested_by: user?.id,
            reason: reason.trim(),
          },
        ]);

      if (error) throw error;

      toast.success("Deletion request submitted successfully");
      setIsOpen(false);
      onRequestSent();
    } catch (error) {
      console.error("Error submitting deletion request:", error);
      toast.error("Failed to submit deletion request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Client Deletion</DialogTitle>
          <DialogDescription>
            You are requesting to delete the client: {clientName}. This request will
            need to be approved by an administrator.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Please provide a reason for deletion..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};