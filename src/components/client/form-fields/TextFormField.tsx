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

  return (
    <FormField
      control={form.control}
      name={field.field_id}
      rules={{
        validate: handleUrlValidation
      }}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              {...formField}
              type={inputType}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              onChange={(e) => {
                let value = e.target.value;
                if (field.type === "url" && value && !value.match(/^https?:\/\//)) {
                  // Only add http:// when saving/submitting, not during typing
                  formField.onChange(value);
                } else {
                  formField.onChange(value);
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