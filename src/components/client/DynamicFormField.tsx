import { FormField as FormFieldType } from "@/types";
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
      default:
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