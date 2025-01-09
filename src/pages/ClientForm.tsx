import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicFormField } from "@/components/client/DynamicFormField";
import { ClientFormHeader } from "@/components/client/ClientFormHeader";
import { DocumentUpload } from "@/components/client/DocumentUpload";
import { useFormFields } from "@/hooks/useFormFields";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, FileText } from "lucide-react";

interface ClientFormData {
  [key: string]: any;
}

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const { fields } = useFormFields();

  const form = useForm<ClientFormData>({
    defaultValues: {},
  });

  // Fetch client data if editing
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
        toast.error('Failed to fetch client details');
        throw error;
      }

      if (!data) {
        toast.error('Client not found');
        navigate('/clients');
        return null;
      }

      console.log('Client details:', data);
      form.reset(data);
      return data;
    },
    enabled: isEditing,
  });

  const mutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      console.log('Saving client data:', data);
      
      if (isEditing) {
        const { error } = await supabase
          .from('clients')
          .update(data)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      console.log('Client saved successfully');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`Client ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/clients');
    },
    onError: (error) => {
      console.error('Error saving client:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} client`);
    },
  });

  const onSubmit = (data: ClientFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading client details...</div>;
  }

  // Group fields by category
  const personalFields = fields.filter(f => 
    ['name', 'email', 'phone', 'gender', 'qualification', 'website'].includes(f.field_id)
  );
  
  const addressFields = fields.filter(f => 
    ['street', 'suburb', 'city', 'postcode'].includes(f.field_id)
  );

  // Get remaining fields that aren't in personal or address groups
  const otherFields = fields.filter(f => 
    !personalFields.map(p => p.field_id).includes(f.field_id) &&
    !addressFields.map(a => a.field_id).includes(f.field_id)
  );

  return (
    <div className="container max-w-3xl space-y-6 p-4">
      <ClientFormHeader isEditing={isEditing} />

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Personal Info
              </TabsTrigger>
              {isEditing && (
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="personal">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {personalFields.map((field) => (
                        <DynamicFormField
                          key={field.id}
                          field={field}
                          form={form}
                        />
                      ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {addressFields.map((field) => (
                        <DynamicFormField
                          key={field.id}
                          field={field}
                          form={form}
                        />
                      ))}
                    </div>

                    {otherFields.length > 0 && (
                      <div className="grid gap-4 md:grid-cols-2">
                        {otherFields.map((field) => (
                          <DynamicFormField
                            key={field.id}
                            field={field}
                            form={form}
                          />
                        ))}
                      </div>
                    )}
                  </div>

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
              <TabsContent value="documents">
                <DocumentUpload clientId={id} />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;