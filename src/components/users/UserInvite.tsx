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
      console.log("Creating new user with details:", newUser);

      if (!newUser.name.trim() || !newUser.email.trim()) {
        toast.error("Please fill in all fields");
        return;
      }

      if (!newUser.email.includes("@")) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Call the Edge Function to create the user
      const { data, error: functionError } = await supabase.functions.invoke('create-user', {
        body: {
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      });

      if (functionError) {
        console.error("Error from create-user function:", functionError);
        toast.error("Failed to create user");
        return;
      }

      console.log("User creation response:", data);

      setNewUser({ name: "", email: "", role: "employee" });
      toast.success("User added successfully. They will receive an email to set their password.");

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