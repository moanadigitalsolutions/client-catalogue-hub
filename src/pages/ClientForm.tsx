import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientFormHeader } from "@/components/client/ClientFormHeader";
import { DocumentUpload } from "@/components/client/DocumentUpload";
import { ClientHistory } from "@/components/client/ClientHistory";
import { useFormFields } from "@/hooks/useFormFields";
import { useFormFieldsSubscription } from "@/hooks/useFormFieldsSubscription";
import { useClientMutations } from "@/hooks/useClientMutations";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, FileText, History } from "lucide-react";
import { ClientFormFields } from "@/components/client/ClientFormFields";

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { fields } = useFormFields();
  const mutation = useClientMutations(id);
  
  useFormFieldsSubscription();

  const form = useForm({
    defaultValues: {},
  });

  const { isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (!id) return null;
      console.log('Fetching client details:', id);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching client:', error);
        throw error;
      }

      if (!data) {
        navigate('/clients');
        return null;
      }

      // Map dob to birth_date for the form
      if (data.dob) {
        data.birth_date = data.dob;
      }

      console.log('Client details:', data);
      form.reset(data);
      return data;
    },
    enabled: isEditing,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading client details...</div>;
  }

  return (
    <div className="container max-w-3xl space-y-6 p-4">
      <ClientFormHeader isEditing={isEditing} />

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Personal Info
              </TabsTrigger>
              {isEditing && (
                <>
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    History
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="personal">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                  <ClientFormFields form={form} fields={fields} />
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/clients")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                      {isEditing ? "Update Client" : "Create Client"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {isEditing && (
              <>
                <TabsContent value="documents">
                  <DocumentUpload clientId={id} />
                </TabsContent>
                <TabsContent value="history">
                  <ClientHistory clientId={id} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;