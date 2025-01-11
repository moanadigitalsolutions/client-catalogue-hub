import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Shield, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { UserRoleSelect } from "./UserRoleSelect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

// Move user actions to a separate component
const UserActions = ({ userId, currentUserId, loading, onDelete }: { 
  userId: string; 
  currentUserId: string | undefined; 
  loading: boolean;
  onDelete: (userId: string) => Promise<void>;
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => onDelete(userId)}
    disabled={loading || userId === currentUserId}
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);

// Move name editing to a separate component
const UserNameEditor = ({ 
  user, 
  isEditing, 
  editingName, 
  onStartEdit, 
  onSave, 
  onCancel, 
  onNameChange 
}: {
  user: { id: string; name: string; role: string };
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (value: string) => void;
}) => (
  <div className="flex items-center gap-2">
    {user.role === 'admin' && <Shield className="h-4 w-4 text-blue-500" />}
    {isEditing ? (
      <div className="flex items-center gap-2">
        <Input
          value={editingName}
          onChange={(e) => onNameChange(e.target.value)}
          className="max-w-[200px]"
        />
        <Button variant="ghost" size="icon" onClick={onSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <span>{user.name || 'Unnamed User'}</span>
        <Button variant="ghost" size="icon" onClick={onStartEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    )}
  </div>
);

export const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users...');
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      const transformedData = profiles.map(profile => ({
        id: profile.id,
        name: profile.name || 'Unnamed User',
        email: profile.email || '',
        role: userRoles.find(role => role.user_id === profile.id)?.role || 'employee'
      }));

      console.log('Transformed user data:', transformedData);
      return transformedData;
    },
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      if (userId === currentUser?.id) {
        toast.error("You cannot delete your own account");
        return;
      }

      const { error: functionError } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (functionError) {
        console.error('Error response from delete-user function:', functionError);
        toast.error('Failed to delete user');
        return;
      }

      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Error in handleDeleteUser:', error);
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (user: { id: string; name: string }) => {
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
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      cancelEditing();
    } catch (error) {
      console.error('Error in handleUpdateName:', error);
      toast.error('Failed to update user name');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading users. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <UserNameEditor
                      user={user}
                      isEditing={editingUserId === user.id}
                      editingName={editingName}
                      onStartEdit={() => startEditing(user)}
                      onSave={() => handleUpdateName(user.id)}
                      onCancel={cancelEditing}
                      onNameChange={setEditingName}
                    />
                  </TableCell>
                  <TableCell>{user.email || 'No email'}</TableCell>
                  <TableCell>
                    <UserRoleSelect 
                      userId={user.id} 
                      currentRole={user.role} 
                      onRoleChange={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
                    />
                  </TableCell>
                  <TableCell>
                    <UserActions
                      userId={user.id}
                      currentUserId={currentUser?.id}
                      loading={loading}
                      onDelete={handleDeleteUser}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};