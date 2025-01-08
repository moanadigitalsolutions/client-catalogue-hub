import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserList } from "@/components/users/UserList";
import { UserInvite } from "@/components/users/UserInvite";
import { toast } from "sonner";

const Users = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) return;

      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking user role:', error);
        toast.error('Error checking permissions');
        navigate('/dashboard');
        return;
      }

      if (!userRoles || userRoles.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        navigate('/dashboard');
      }
    };

    checkAdminAccess();
  }, [user, navigate]);

  return (
    <div className="container space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      
      <div className="grid gap-6">
        <UserInvite />
        <UserList />
      </div>
    </div>
  );
};

export default Users;