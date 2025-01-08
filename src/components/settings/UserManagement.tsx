import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { PlusCircle, Trash2 } from "lucide-react";
import { User, UserRole } from "@/types";

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" },
  ]);

  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "employee",
  });

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!newUser.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (users.some((user) => user.email === newUser.email)) {
      toast.error("A user with this email already exists");
      return;
    }

    const id = Math.random().toString(36).substr(2, 9);
    setUsers([...users, { ...newUser, id }]);
    setNewUser({ name: "", email: "", role: "employee" });
    toast.success("User added successfully");
  };

  const handleRemoveUser = (id: string) => {
    if (users.length === 1) {
      toast.error("Cannot remove the last admin user");
      return;
    }

    const user = users.find((u) => u.id === id);
    if (user?.role === "admin" && users.filter((u) => u.role === "admin").length === 1) {
      toast.error("Cannot remove the last admin user");
      return;
    }

    setUsers(users.filter((user) => user.id !== id));
    toast.success("User removed successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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

              <Button onClick={handleAddUser} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
