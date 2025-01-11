import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormField as FormFieldType } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { format, parse, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DateFormFieldProps {
  field: FormFieldType;
  form: UseFormReturn<any>;
}

export const DateFormField = ({ field, form }: DateFormFieldProps) => {
  console.log('Rendering date form field:', field);
  const [inputValue, setInputValue] = useState("");

  const handleDateChange = (value: string) => {
    setInputValue(value);
    
    // Only attempt to parse if we have a complete date string
    if (value.length === 10) {
      try {
        const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          form.setValue(field.field_id, parsedDate);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name={field.field_id}
      render={({ field: formField }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              placeholder="DD/MM/YYYY"
              value={inputValue || (formField.value ? format(new Date(formField.value), 'dd/MM/yyyy') : '')}
              onChange={(e) => {
                const value = e.target.value;
                // Add slashes automatically
                let formattedValue = value.replace(/[^0-9]/g, '');
                if (formattedValue.length > 0) {
                  formattedValue = formattedValue.match(/.{1,2}/g)?.join('/') || '';
                  if (formattedValue.length > 10) {
                    formattedValue = formattedValue.slice(0, 10);
                  }
                }
                handleDateChange(formattedValue);
              }}
              onBlur={formField.onBlur}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};