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
        return "text"; // Changed to text to handle custom formatting
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

  const handleCurrencyValidation = (value: string) => {
    if (field.type !== "currency" || !value) return true;
    
    // Remove currency symbol and commas
    const numericValue = value.replace(/[$,]/g, '');
    
    // Check if it's a valid number with up to 2 decimal places
    if (!/^\d*\.?\d{0,2}$/.test(numericValue)) {
      return "Please enter a valid amount";
    }
    
    return true;
  };

  const formatCurrencyInput = (value: string) => {
    if (!value) return '';
    
    // Remove any non-numeric characters except decimal point
    let numericValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      numericValue = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return numericValue;
  };

  const formatCurrencyDisplay = (value: string) => {
    if (!value) return '';
    const number = parseFloat(value);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  };

  return (
    <FormField
      control={form.control}
      name={field.field_id}
      rules={{
        validate: {
          url: handleUrlValidation,
          currency: handleCurrencyValidation
        },
        pattern: field.type === "phone" ? {
          value: /^[0-9+()-\s]*$/,
          message: "Please enter a valid phone number"
        } : undefined
      }}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              {...formField}
              type={inputType}
              placeholder={field.type === "currency" ? "$0.00" : `Enter ${field.label.toLowerCase()}`}
              className="h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => {
                let value = e.target.value;
                
                if (field.type === "url" && value && !value.match(/^https?:\/\//)) {
                  formField.onChange(value);
                } else if (field.type === "phone") {
                  value = value.replace(/[^\d+()-\s]/g, '');
                  formField.onChange(value);
                } else if (field.type === "currency") {
                  value = formatCurrencyInput(value);
                  formField.onChange(value);
                } else {
                  formField.onChange(value);
                }
              }}
              onBlur={(e) => {
                if (field.type === "currency" && e.target.value) {
                  const numericValue = parseFloat(e.target.value);
                  if (!isNaN(numericValue)) {
                    const formattedValue = numericValue.toFixed(2);
                    formField.onChange(formattedValue);
                    // Update input display with formatted currency
                    e.target.value = formatCurrencyDisplay(formattedValue);
                  }
                }
                formField.onBlur();
              }}
              onFocus={(e) => {
                if (field.type === "currency") {
                  // Show raw number without currency formatting when focused
                  e.target.value = formField.value || '';
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};