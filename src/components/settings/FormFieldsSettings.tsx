import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormFieldList } from "./FormFieldList";
import { NewFieldForm } from "./NewFieldForm";
import { FormField } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const FormFieldsSettings = () => {
  const queryClient = useQueryClient();

  const { data: fields = [], isLoading } = useQuery({
    queryKey: ['formFields'],
    queryFn: async () => {
      console.log('Fetching form fields...');
      const { data, error } = await supabase
        .from('form_fields')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Error fetching form fields:', error);
        toast.error('Failed to load form fields');
        throw error;
      }

      console.log('Form fields loaded:', data);
      return data as FormField[];
    },
  });

  const handleFieldsUpdate = (updatedFields: FormField[]) => {
    queryClient.setQueryData(['formFields'], updatedFields);
  };

  const handleFieldAdded = (newField: FormField) => {
    queryClient.setQueryData(['formFields'], (old: FormField[] = []) => [...old, newField]);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Form Fields Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <p>Loading form fields...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Fields Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <FormFieldList 
            fields={fields} 
            onFieldsUpdate={handleFieldsUpdate} 
          />
          <NewFieldForm 
            onFieldAdded={handleFieldAdded}
            existingFields={fields}
          />
        </div>
      </CardContent>
    </Card>
  );
};