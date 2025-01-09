import { DynamicFormField } from "@/components/client/DynamicFormField";
import { FormField } from "@/types";
import { UseFormReturn } from "react-hook-form";

interface ClientFormFieldsProps {
  form: UseFormReturn<any>;
  fields: FormField[];
}

export const ClientFormFields = ({ form, fields }: ClientFormFieldsProps) => {
  const personalFields = fields.filter(f => 
    ['name', 'email', 'phone', 'gender', 'qualification', 'website'].includes(f.field_id)
  );
  
  const addressFields = fields.filter(f => 
    ['street', 'suburb', 'city', 'postcode'].includes(f.field_id)
  );

  const otherFields = fields.filter(f => 
    !personalFields.map(p => p.field_id).includes(f.field_id) &&
    !addressFields.map(a => a.field_id).includes(f.field_id)
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {personalFields.map((field) => (
          <DynamicFormField
            key={field.id}
            field={field}
            form={form}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addressFields.map((field) => (
          <DynamicFormField
            key={field.id}
            field={field}
            form={form}
          />
        ))}
      </div>

      {otherFields.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {otherFields.map((field) => (
            <DynamicFormField
              key={field.id}
              field={field}
              form={form}
            />
          ))}
        </div>
      )}
    </div>
  );
};