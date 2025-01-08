import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { PlusCircle, Trash2 } from "lucide-react";
import { User, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "employee",
  });

  const handleAddUser = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!newUser.name.trim() || !newUser.email.trim()) {
        toast.error("Please fill in all fields");
        return;
      }

      if (!newUser.email.includes("@")) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: "tempPassword123!", // You might want to generate this randomly
        email_confirm: true,
      });

      if (authError) {
        console.error("Error creating user:", authError);
        setError(authError.message);
        toast.error("Failed to create user");
        return;
      }

      if (!authData.user) {
        setError("Failed to create user");
        return;
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        setError(profileError.message);
        return;
      }

      // Assign user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: authData.user.id,
          role: newUser.role,
        });

      if (roleError) {
        console.error("Error assigning role:", roleError);
        setError(roleError.message);
        return;
      }

      // Add to local state
      setUsers([...users, { ...newUser, id: authData.user.id }]);
      setNewUser({ name: "", email: "", role: "employee" });
      toast.success("User added successfully");

    } catch (error) {
      console.error("Error in handleAddUser:", error);
      setError("An unexpected error occurred");
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase.auth.admin.deleteUser(id);

      if (deleteError) {
        console.error("Error deleting user:", deleteError);
        setError(deleteError.message);
        toast.error("Failed to delete user");
        return;
      }

      setUsers(users.filter((user) => user.id !== id));
      toast.success("User removed successfully");
    } catch (error) {
      console.error("Error in handleRemoveUser:", error);
      setError("An unexpected error occurred");
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
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
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New User */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New User</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userName">Name</Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Enter user's name"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Enter user's email"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label>Role</Label>
                <RadioGroup
                  value={newUser.role}
                  onValueChange={(value: UserRole) =>
                    setNewUser({ ...newUser, role: value })
                  }
                  className="flex gap-4"
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employee" id="employee" />
                    <Label htmlFor="employee">Employee</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button onClick={handleAddUser} className="w-full" disabled={loading}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {loading ? "Adding User..." : "Add User"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
