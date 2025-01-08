import { FormField as FormFieldType } from "@/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface CheckboxFormFieldProps {
  field: FormFieldType;
  form: UseFormReturn<any>;
}

export const CheckboxFormField = ({ field, form }: CheckboxFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={field.field_id}
      render={({ field: formField }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
          <FormControl>
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
          </FormControl>
          <FormLabel className="font-normal">{field.label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};