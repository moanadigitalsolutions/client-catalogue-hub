import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Shield } from "lucide-react";
import { toast } from "sonner";
import { UserRoleSelect } from "./UserRoleSelect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

export const UserList = () => {
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users...');
      
      // First, get all profiles with their roles
      const { data: profilesWithRoles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          user_roles (
            role
          )
        `);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Transform the data to match our expected format
      const transformedData = profilesWithRoles.map(profile => ({
        id: profile.id,
        name: profile.name || 'Unnamed User',
        email: profile.email || 'No email',
        role: profile.user_roles?.[0]?.role || 'employee'
      }));

      console.log('Transformed user data:', transformedData);
      return transformedData;
    },
  });

  const handleDeleteUser = async (userId: string, userRole: string) => {
    try {
      setLoading(true);

      // Check if trying to delete own account
      if (userId === currentUser?.id) {
        toast.error("You cannot delete your own account");
        return;
      }

      // First try to delete the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) {
        if (roleError.message.includes('Cannot delete the last admin user')) {
          toast.error('Cannot delete the last admin user');
        } else {
          console.error('Error deleting user role:', roleError);
          toast.error('Failed to delete user');
        }
        return;
      }

      // If role deletion succeeded, proceed with profile deletion
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        toast.error('Failed to delete user');
        return;
      }

      toast.success('User deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error in handleDeleteUser:', error);
      toast.error('Failed to delete user');
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
                  <TableCell className="flex items-center gap-2">
                    {user.role === 'admin' && (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <UserRoleSelect 
                      userId={user.id} 
                      currentRole={user.role} 
                      onRoleChange={() => refetch()}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id, user.role)}
                      disabled={loading || user.id === currentUser?.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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