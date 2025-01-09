import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";
import { FormField } from "@/types";

interface TableHeaderProps {
  selectedFields: string[];
  fields: FormField[];
}

export const ReportTableHeader = ({ selectedFields, fields }: TableHeaderProps) => {
  const getFieldLabel = (fieldId: string) => {
    const field = fields.find(f => f.field_id === fieldId);
    return field?.label || fieldId;
  };

  return (
    <ShadcnTableHeader>
      <TableRow>
        {selectedFields.map((fieldId) => (
          <TableHead key={fieldId}>{getFieldLabel(fieldId)}</TableHead>
        ))}
      </TableRow>
    </ShadcnTableHeader>
  );
};