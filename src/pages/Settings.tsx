import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormFieldsSettings } from "@/components/settings/FormFieldsSettings";
import { UserManagement } from "@/components/settings/UserManagement";
import { DataImportExport } from "@/components/settings/DataImportExport";
import { DeletionRequests } from "@/components/settings/DeletionRequests";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();

  const { data: userRole, isLoading, error } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      console.log('Fetching user role...');
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }

      console.log('User role:', data?.role);
      return data?.role || null;
    },
  });

  if (isLoading) {
    return (
      <div className="container space-y-8 p-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container space-y-8 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error loading user role. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If user is not an admin, show access denied message and redirect
  if (userRole !== 'admin') {
    console.log('User is not admin, redirecting to dashboard');
    return (
      <div className="container space-y-8 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need administrator privileges to access this page.
          </AlertDescription>
        </Alert>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return (
    <div className="container space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="forms">Form Fields</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="requests">Deletion Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="forms" className="mt-6">
          <FormFieldsSettings />
        </TabsContent>
        
        <TabsContent value="data" className="mt-6">
          <DataImportExport />
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <DeletionRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;