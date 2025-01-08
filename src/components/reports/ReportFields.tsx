import { FormField } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ReportFieldsProps {
  fields: FormField[];
  selectedFields: string[];
  onFieldToggle: (fieldId: string) => void;
  onSelectAll: () => void;
}

export const ReportFields = ({
  fields,
  selectedFields,
  onFieldToggle,
  onSelectAll,
}: ReportFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select Fields</h3>
        <Button variant="outline" size="sm" onClick={onSelectAll}>
          Select All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field: FormField) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={selectedFields.includes(field.id)}
              onCheckedChange={() => onFieldToggle(field.id)}
            />
            <label
              htmlFor={field.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};