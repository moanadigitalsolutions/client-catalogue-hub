import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { UserList } from "./user-management/UserList";
import { AddUserForm } from "./user-management/AddUserForm";
import { supabase } from "@/lib/supabase";

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setError('Failed to load users');
        return;
      }

      // Then get their roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        setError('Failed to load user roles');
        return;
      }

      // Combine the data
      const transformedData = profiles.map(profile => ({
        id: profile.id,
        name: profile.name || 'Unnamed User',
        email: profile.email || '',
        role: userRoles.find(role => role.user_id === profile.id)?.role || 'employee'
      }));

      setUsers(transformedData);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Existing Users */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Users</h3>
            <UserList
              users={users}
              loading={loading}
              currentUserId={currentUser?.id}
              onUserDeleted={fetchUsers}
            />
          </div>

          {/* Add New User */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New User</h3>
            <AddUserForm loading={loading} onUserAdded={fetchUsers} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};