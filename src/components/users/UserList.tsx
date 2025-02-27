import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { UserActions } from "./UserActions";
import { UserNameEditor } from "./UserNameEditor";
import { UserRoleCell } from "./UserRoleCell";
import { UserRole } from "@/types";

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
        role: (userRoles.find(role => role.user_id === profile.id)?.role || 'employee') as UserRole
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

  const startEditing = (user: { id: string; name: string | null }) => {
    setEditingUserId(user.id);
    setEditingName(user.name || '');
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditingName("");
  };

  const handleUpdateName = async (userId: string) => {
    try {
      setLoading(true);
      console.log('Starting name update for user:', userId, 'New name:', editingName);
      
      // Update the profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: editingName })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user name:', updateError);
        toast.error('Failed to update user name');
        return;
      }

      // Fetch the updated data to ensure we have the latest state
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching updated profile:', fetchError);
        toast.error('Failed to fetch updated user data');
        return;
      }

      // Update the local cache with the confirmed data from the server
      const oldData = queryClient.getQueryData(['users']) as any[];
      if (oldData) {
        const newData = oldData.map(user => 
          user.id === userId ? { ...user, name: updatedProfile.name || 'Unnamed User' } : user
        );
        queryClient.setQueryData(['users'], newData);
      }

      // Force an immediate refetch to ensure we're fully in sync
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast.success('User name updated successfully');
      cancelEditing();
    } catch (error) {
      console.error('Error in handleUpdateName:', error);
      toast.error('Failed to update user name');
    } finally {
      setLoading(false);
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
                    <UserRoleCell 
                      userId={user.id}
                      currentRole={user.role}
                      queryClient={queryClient}
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