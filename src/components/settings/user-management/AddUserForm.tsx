import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRole } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["admin", "employee"] as const),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AddUserFormProps {
  onUserAdded: () => void;
  loading?: boolean;
}

export const AddUserForm = ({ onUserAdded, loading }: AddUserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "employee" as UserRole,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Creating new user:", { ...values, password: "[REDACTED]" });

      // First check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, is_active')
        .eq('email', values.email)
        .maybeSingle();

      if (existingUser) {
        if (!existingUser.is_active) {
          toast.error("This user has been deactivated. Please reactivate their account instead of creating a new one.");
        } else {
          toast.error("A user with this email already exists.");
        }
        return;
      }

      // Create the user
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        },
      });

      if (signUpError) {
        console.error("Error creating user:", signUpError);
        if (signUpError.message === "User already registered") {
          toast.error("A user with this email already exists.");
        } else {
          toast.error(signUpError.message);
        }
        return;
      }

      if (!userData.user) {
        toast.error("Failed to create user");
        return;
      }

      // Insert into profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          name: values.name,
          email: values.email,
          is_active: true
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        toast.error("Failed to create user profile");
        return;
      }

      // Assign role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.user.id,
          role: values.role,
        });

      if (roleError) {
        console.error("Error assigning role:", roleError);
        toast.error("Failed to assign user role");
        return;
      }

      toast.success("User created successfully");
      form.reset();
      onUserAdded();
    } catch (error) {
      console.error("Error in user creation:", error);
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter name" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter email" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Enter password" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Confirm password" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <FormLabel htmlFor="admin" className="cursor-pointer">Admin</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employee" id="employee" />
                    <FormLabel htmlFor="employee" className="cursor-pointer">Employee</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || loading}>
          {isSubmitting ? "Creating User..." : "Create User"}
        </Button>
      </form>
    </Form>
  );
};