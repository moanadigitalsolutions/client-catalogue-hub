import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { UserList } from "./user-management/UserList";
import { AddUserForm } from "./user-management/AddUserForm";

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const handleUserAdded = () => {
    // Refresh the users list
    // You might want to implement a proper fetch users function here
    setUsers([...users]);
  };

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
              onUserDeleted={handleUserAdded}
            />
          </div>

          {/* Add New User */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New User</h3>
            <AddUserForm loading={loading} onUserAdded={handleUserAdded} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
