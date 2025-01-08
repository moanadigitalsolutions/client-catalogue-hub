import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

export const UserInvite = () => {
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "employee" as UserRole,
  });

  const handleAddUser = async () => {
    try {
      setLoading(true);

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
        toast.error("Failed to create user");
        return;
      }

      if (!authData.user) {
        toast.error("Failed to create user");
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
        toast.error("Failed to create user profile");
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
        toast.error("Failed to assign user role");
        return;
      }

      setNewUser({ name: "", email: "", role: "employee" });
      toast.success("User added successfully");

    } catch (error) {
      console.error("Error in handleAddUser:", error);
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite New User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="userName">Name</Label>
            <Input
              id="userName"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
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
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Enter user's email"
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label>Role</Label>
            <RadioGroup
              value={newUser.role}
              onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
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
      </CardContent>
    </Card>
  );
};