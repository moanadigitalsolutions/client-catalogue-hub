import { FormField } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextFormField } from "@/components/client/form-fields/TextFormField";
import { TextareaFormField } from "@/components/client/form-fields/TextareaFormField";
import { SelectFormField } from "@/components/client/form-fields/SelectFormField";
import { RadioFormField } from "@/components/client/form-fields/RadioFormField";
import { CheckboxFormField } from "@/components/client/form-fields/CheckboxFormField";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface FormPreviewProps {
  title: string;
  description?: string;
  fields: FormField[];
  onClose: () => void;
}

export const FormPreview = ({ title, description, fields, onClose }: FormPreviewProps) => {
  const form = useForm();

  const renderField = (field: FormField) => {
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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Eye className="h-4 w-4 mr-2" />
            Exit Preview
          </Button>
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {fields.map((field) => renderField(field))}
            <Button type="submit" className="w-full" disabled>
              Submit (Preview Mode)
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};