import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { TextFormField } from "@/components/client/form-fields/TextFormField";
import { TextareaFormField } from "@/components/client/form-fields/TextareaFormField";
import { SelectFormField } from "@/components/client/form-fields/SelectFormField";
import { RadioFormField } from "@/components/client/form-fields/RadioFormField";
import { CheckboxFormField } from "@/components/client/form-fields/CheckboxFormField";

const PublicForm = () => {
  const { publicUrlKey } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm();

  const { data: formData, isLoading } = useQuery({
    queryKey: ['public-form', publicUrlKey],
    queryFn: async () => {
      console.log('Fetching public form:', publicUrlKey);
      const { data, error } = await supabase
        .from('registration_forms')
        .select('*')
        .eq('public_url_key', publicUrlKey)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching form:', error);
        throw error;
      }

      return data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (formData: any) => {
      console.log('Submitting form data:', formData);
      const { data, error } = await supabase
        .from('form_submissions')
        .insert([
          {
            form_id: formData.id,
            data: formData.submissionData,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Form submitted successfully!");
      form.reset();
    },
    onError: (error) => {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit form");
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        id: formData.id,
        submissionData: data,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <p>Loading form...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-lg font-medium">Form not found or no longer active</p>
              <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderField = (field: any) => {
    switch (field.type) {
      case 'textarea':
        return <TextareaFormField key={field.field_id} field={field} form={form} />;
      case 'select':
        return <SelectFormField key={field.field_id} field={field} form={form} />;
      case 'radio':
        return <RadioFormField key={field.field_id} field={field} form={form} />;
      case 'checkbox':
        return <CheckboxFormField key={field.field_id} field={field} form={form} />;
      default:
        return <TextFormField key={field.field_id} field={field} form={form} />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{formData.title}</CardTitle>
          {formData.description && (
            <CardDescription>{formData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {formData.elements?.map((field: any) => renderField(field))}
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicForm;