import { FormField as FormFieldType } from "@/types/index";
import { UseFormReturn } from "react-hook-form";
import { TextFormField } from "./form-fields/TextFormField";
import { TextareaFormField } from "./form-fields/TextareaFormField";
import { CheckboxFormField } from "./form-fields/CheckboxFormField";
import { SelectFormField } from "./form-fields/SelectFormField";
import { RadioFormField } from "./form-fields/RadioFormField";
import { FieldDescription } from "./FieldDescription";

interface DynamicFormFieldProps {
  field: FormFieldType;
  form: UseFormReturn<any>;
}

export const DynamicFormField = ({ field, form }: DynamicFormFieldProps) => {
  console.log('Rendering dynamic form field:', field);

  const FormFieldComponent = (() => {
    switch (field.type) {
      case "textarea":
        return <TextareaFormField field={field} form={form} />;
      case "checkbox":
        return <CheckboxFormField field={field} form={form} />;
      case "select":
        return <SelectFormField field={field} form={form} />;
      case "radio":
        return <RadioFormField field={field} form={form} />;
      case "url":
      case "email":
      case "phone":
      case "text":
        return <TextFormField field={field} form={form} />;
      default:
        console.log('Using default text form field for type:', field.type);
        return <TextFormField field={field} form={form} />;
    }
  })();

  return (
    <div className="relative">
      {FormFieldComponent}
      <FieldDescription fieldId={field.field_id} />
    </div>
  );
};