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
import { useState, useEffect } from "react";

interface DateFormFieldProps {
  field: FormFieldType;
  form: UseFormReturn<any>;
}

export const DateFormField = ({ field, form }: DateFormFieldProps) => {
  console.log('Rendering date form field:', field);
  const [inputValue, setInputValue] = useState("");

  // Effect to handle initial form value
  useEffect(() => {
    const value = form.getValues(field.field_id);
    if (value) {
      try {
        const date = new Date(value);
        if (isValid(date)) {
          setInputValue(format(date, 'dd/MM/yyyy'));
        }
      } catch (error) {
        console.error('Error formatting initial date:', error);
      }
    }
  }, [field.field_id, form]);

  const handleDateChange = (value: string) => {
    setInputValue(value);
    
    // Only attempt to parse if we have a complete date string
    if (value.length === 10) {
      try {
        const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          console.log('Valid date parsed:', parsedDate);
          // Format the date as ISO string for database storage
          form.setValue(field.field_id, format(parsedDate, 'yyyy-MM-dd'));
        } else {
          console.log('Invalid date:', value);
          form.setError(field.field_id, {
            type: 'manual',
            message: 'Please enter a valid date in DD/MM/YYYY format'
          });
        }
      } catch (error) {
        console.error('Error parsing date:', error);
        form.setError(field.field_id, {
          type: 'manual',
          message: 'Please enter a valid date in DD/MM/YYYY format'
        });
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name={field.field_id}
      rules={{
        validate: (value) => {
          if (field.required && !value) {
            return 'Date is required';
          }
          if (value) {
            try {
              const date = new Date(value);
              return isValid(date) || 'Please enter a valid date';
            } catch {
              return 'Please enter a valid date';
            }
          }
          return true;
        }
      }}
      render={({ field: formField }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              placeholder="DD/MM/YYYY"
              value={inputValue}
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