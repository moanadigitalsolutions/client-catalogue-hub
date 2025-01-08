import { FormField as FormFieldType } from "@/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface TextareaFormFieldProps {
  field: FormFieldType;
  form: UseFormReturn<any>;
}

export const TextareaFormField = ({ field, form }: TextareaFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={field.field_id}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Textarea {...formField} placeholder={`Enter ${field.label.toLowerCase()}`} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};