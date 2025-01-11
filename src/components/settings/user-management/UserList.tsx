import { useState } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface UserListProps {
  users: User[];
  loading: boolean;
  currentUserId: string | undefined;
  onUserDeleted: () => void;
}

export const UserList = ({ users, loading, currentUserId, onUserDeleted }: UserListProps) => {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleRemoveUser = async (id: string) => {
    try {
      console.log('Calling delete-user function for userId:', id);
      
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

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setEditingName(user.name);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditingName("");
  };

  const handleUpdateName = async (userId: string) => {
    try {
      console.log('Updating name for user:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ name: editingName })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user name:', error);
        toast.error('Failed to update user name');
        return;
      }

      toast.success('User name updated successfully');
      onUserDeleted(); // Refresh the list
      cancelEditing();
    } catch (error) {
      console.error('Error in handleUpdateName:', error);
      toast.error('Failed to update user name');
    }
  };

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
        >
          <div className="space-y-1 flex-1">
            {editingUserId === user.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="max-w-[200px]"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdateName(user.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelEditing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="font-medium">{user.name}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEditing(user)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
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