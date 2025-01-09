import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

interface AddUserFormProps {
  loading: boolean;
  onUserAdded: () => void;
}

export const AddUserForm = ({ loading, onUserAdded }: AddUserFormProps) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "employee" as UserRole,
  });

  const handleAddUser = async () => {
    try {
      if (!newUser.name.trim() || !newUser.email.trim()) {
        toast.error("Please fill in all fields");
        return;
      }

      if (!newUser.email.includes("@")) {
        toast.error("Please enter a valid email address");
        return;
      }

      console.log("Creating new user with email:", newUser.email);

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      // Sign up the user using the standard auth API
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: tempPassword,
        options: {
          data: {
            name: newUser.name,
          },
        },
      });

      if (signUpError) {
        console.error("Error creating user:", signUpError);
        toast.error("Failed to create user");
        return;
      }

      if (!authData.user) {
        toast.error("Failed to create user");
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
        toast.error("Failed to assign role");
        return;
      }

      setNewUser({ name: "", email: "", role: "employee" });
      toast.success("User added successfully. They will receive an email to set their password.");
      onUserAdded();
    } catch (error) {
      console.error("Error in handleAddUser:", error);
      toast.error("Failed to create user");
    }
  };

  return (
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
  );
};