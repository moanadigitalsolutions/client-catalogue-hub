import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface UserListProps {
  users: User[];
  loading: boolean;
  currentUserId: string | undefined;
  onUserDeleted: () => void;
}

export const UserList = ({ users, loading, currentUserId, onUserDeleted }: UserListProps) => {
  const handleRemoveUser = async (id: string) => {
    try {
      console.log('Calling delete-user function for userId:', id);
      
      // Call the Edge Function to delete the user using the supabase client
      const { data: functionData, error: functionError } = await supabase.functions.invoke('delete-user', {
        body: { userId: id }
      });

      if (functionError) {
        console.error('Error response from delete-user function:', functionError);
        toast.error('Failed to delete user');
        return;
      }

      console.log('Delete user response:', functionData);
      toast.success('User deleted successfully');
      onUserDeleted();
    } catch (error) {
      console.error('Error in handleRemoveUser:', error);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
        >
          <div className="space-y-1">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">
              {user.email} ({user.role})
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveUser(user.id)}
            disabled={loading || user.id === currentUserId}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};