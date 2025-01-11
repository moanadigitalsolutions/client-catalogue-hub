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
import { useQuery } from "@tanstack/react-query";

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

  // Fetch user role with proper error handling
  const { data: userRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      console.log('Fetching user role for:', user?.id);
      
      // First check if user has a role
      const { data: existingRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        throw roleError;
      }

      // If no role exists, create default employee role
      if (!existingRole) {
        console.log('No role found, creating default employee role');
        const { data: newRole, error: insertError } = await supabase
          .from('user_roles')
          .insert([
            { user_id: user?.id, role: 'employee' }
          ])
          .select('role')
          .single();

        if (insertError) {
          console.error('Error creating default role:', insertError);
          throw insertError;
        }

        return newRole?.role || 'employee';
      }

      console.log('User role:', existingRole?.role);
      return existingRole?.role || 'employee';
    },
    enabled: !!user?.id,
  });

  const isAdmin = userRole === 'admin';

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId);

      if (error) throw error;

      toast.success("Client deleted successfully");
      setIsOpen(false);
      onRequestSent();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestDeletion = async () => {
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
          <DialogTitle>
            {isAdmin ? "Delete Client" : "Request Client Deletion"}
          </DialogTitle>
          <DialogDescription>
            {isAdmin
              ? `Are you sure you want to delete the client: ${clientName}?`
              : `You are requesting to delete the client: ${clientName}. This request will need to be approved by an administrator.`}
          </DialogDescription>
        </DialogHeader>
        {!isAdmin && (
          <div className="py-4">
            <Textarea
              placeholder="Please provide a reason for deletion..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={isAdmin ? handleDelete : handleRequestDeletion} 
            disabled={isLoading}
            variant={isAdmin ? "destructive" : "default"}
          >
            {isAdmin ? "Delete" : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};