import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicFormField } from "@/components/client/DynamicFormField";
import { ClientFormHeader } from "@/components/client/ClientFormHeader";
import { useFormFields } from "@/hooks/useFormFields";

interface ClientFormData {
  [key: string]: any;
}

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { fields } = useFormFields();

  const form = useForm<ClientFormData>({
    defaultValues: {},
  });

  console.log("Form values:", form.watch());

  const onSubmit = async (data: ClientFormData) => {
    try {
      console.log("Submitting form data:", data);
      // TODO: Implement API call to save client data
      toast.success(
        `Client successfully ${isEditing ? "updated" : "created"}!`
      );
      navigate("/clients");
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Failed to save client. Please try again.");
    }
  };

  return (
    <div className="container max-w-3xl space-y-6 p-4">
      <ClientFormHeader isEditing={isEditing} />

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <DynamicFormField
                    key={field.id}
                    field={field}
                    form={form}
                  />
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/clients")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? "Update Client" : "Create Client"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;