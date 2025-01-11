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
  
  const inputType = (() => {
    switch (field.type) {
      case "url":
        return "text"; // Changed from "url" to "text" to allow more flexible input
      case "email":
        return "email";
      case "phone":
        return "tel";
      case "currency":
        return "number";
      default:
        return "text";
    }
  })();

  const handleUrlValidation = (value: string) => {
    if (field.type !== "url" || !value) return true;
    
    // Add http:// if no protocol is specified
    const urlToTest = value.match(/^https?:\/\//) ? value : `http://${value}`;
    
    try {
      new URL(urlToTest);
      return true;
    } catch {
      return "Please enter a valid website address";
    }
  };

  const getInputPattern = () => {
    switch (field.type) {
      case "phone":
        return "[0-9+()-\\s]*"; // Allow digits, +, (), - and spaces
      case "currency":
        return "[0-9]*\\.?[0-9]*"; // Allow decimal numbers
      default:
        return undefined;
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    const number = parseFloat(value);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  };

  return (
    <FormField
      control={form.control}
      name={field.field_id}
      rules={{
        validate: handleUrlValidation,
        pattern: field.type === "phone" ? {
          value: /^[0-9+()-\s]*$/,
          message: "Please enter a valid phone number"
        } : field.type === "currency" ? {
          value: /^\d*\.?\d*$/,
          message: "Please enter a valid amount"
        } : undefined
      }}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              {...formField}
              type={inputType}
              pattern={getInputPattern()}
              placeholder={field.type === "currency" ? "$0.00" : `Enter ${field.label.toLowerCase()}`}
              className="h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => {
                let value = e.target.value;
                if (field.type === "url" && value && !value.match(/^https?:\/\//)) {
                  formField.onChange(value);
                } else if (field.type === "phone") {
                  // Format phone number as user types
                  value = value.replace(/[^\d+()-\s]/g, '');
                  formField.onChange(value);
                } else if (field.type === "currency") {
                  // Only allow numbers and decimal point
                  value = value.replace(/[^\d.]/g, '');
                  // Ensure only one decimal point
                  const parts = value.split('.');
                  if (parts.length > 2) {
                    value = parts[0] + '.' + parts.slice(1).join('');
                  }
                  // Limit decimal places to 2
                  if (parts.length === 2 && parts[1].length > 2) {
                    value = parts[0] + '.' + parts[1].slice(0, 2);
                  }
                  formField.onChange(value);
                } else {
                  formField.onChange(value);
                }
              }}
              onBlur={(e) => {
                if (field.type === "currency" && e.target.value) {
                  const numValue = parseFloat(e.target.value);
                  if (!isNaN(numValue)) {
                    // Format to 2 decimal places
                    formField.onChange(numValue.toFixed(2));
                  }
                }
                formField.onBlur();
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};