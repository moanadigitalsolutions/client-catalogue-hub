import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { UserRole } from "@/types";

interface UserRoleSelectProps {
  userId: string;
  currentRole: UserRole;
  onRoleChange: () => void;
}

export const UserRoleSelect = ({ userId, currentRole, onRoleChange }: UserRoleSelectProps) => {
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      setLoading(true);
      console.log('Updating user role...', { userId, newRole });

      const { error } = await supabase
        .from('user_roles')
        .upsert(
          { user_id: userId, role: newRole },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Error updating role:', error);
        toast.error('Failed to update user role');
        return;
      }

      toast.success('User role updated successfully');
      onRoleChange();
    } catch (error) {
      console.error('Error in handleRoleChange:', error);
      toast.error('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      defaultValue={currentRole}
      onValueChange={(value: UserRole) => handleRoleChange(value)}
      disabled={loading}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="employee">Employee</SelectItem>
      </SelectContent>
    </Select>
  );
};