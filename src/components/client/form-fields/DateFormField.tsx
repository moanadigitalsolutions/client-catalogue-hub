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
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Format the date with slashes
    let formattedValue = '';
    if (numericValue.length > 0) {
      // Handle day
      formattedValue = numericValue.slice(0, 2);
      if (numericValue.length > 2) {
        // Handle month
        formattedValue += '/' + numericValue.slice(2, 4);
        if (numericValue.length > 4) {
          // Handle year - ensure we only take up to 4 digits for year
          formattedValue += '/' + numericValue.slice(4, 8);
        }
      }
    }

    setInputValue(formattedValue);
    
    // Only attempt to parse if we have a complete date string (DD/MM/YYYY)
    if (formattedValue.length === 10) {
      try {
        const parsedDate = parse(formattedValue, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          console.log('Valid date parsed:', parsedDate);
          // Format the date as ISO string for database storage
          form.setValue(field.field_id, format(parsedDate, 'yyyy-MM-dd'));
          // Clear any previous errors
          form.clearErrors(field.field_id);
        } else {
          console.log('Invalid date:', formattedValue);
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
              onChange={(e) => handleDateChange(e.target.value)}
              onBlur={formField.onBlur}
              maxLength={10}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};