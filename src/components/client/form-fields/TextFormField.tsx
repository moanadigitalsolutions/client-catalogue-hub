import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormField as FormFieldType } from "@/types";
import { UseFormReturn } from "react-hook-form";

interface TextFormFieldProps {
  field: FormFieldType;
  form: UseFormReturn<any>;
}

export const TextFormField = ({ field, form }: TextFormFieldProps) => {
  console.log('Rendering text form field:', field);
  
  return (
    <FormField
      control={form.control}
      name={field.field_id}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              {...formField}
              type={field.type === "url" ? "url" : "text"}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};