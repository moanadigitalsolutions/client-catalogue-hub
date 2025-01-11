import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface TableContentProps {
  data: any[];
  selectedFields: string[];
}

export const TableContent = ({ data, selectedFields }: TableContentProps) => {
  const formatCellValue = (value: any, fieldId: string) => {
    if (value === null || value === undefined) return '';
    
    // Handle date fields
    if (fieldId === 'birth_date' || fieldId === 'dob') {
      try {
        return format(new Date(value), 'dd/MM/yyyy');
      } catch (error) {
        console.error('Error formatting date:', error);
        return value;
      }
    }

    // Handle boolean fields
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    // Handle array fields (like options)
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return String(value);
  };

  return (
    <TableBody>
      {data.map((row, index) => (
        <TableRow key={index}>
          {selectedFields.map((fieldId) => (
            <TableCell key={fieldId}>
              {formatCellValue(row[fieldId], fieldId)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};