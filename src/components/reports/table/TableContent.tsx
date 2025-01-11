import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

    // Handle numeric fields (including formulas and currency)
    if (fieldId.startsWith('formula_') || typeof value === 'number') {
      const num = Number(value);
      if (isNaN(num)) return value;
      
      // Check if it's a currency field by looking up the field configuration
      const isCurrency = window.formFields?.some(
        field => field.field_id === fieldId && field.type === 'currency'
      );
      
      return isCurrency 
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
        : num.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          });
    }

    return String(value);
  };

  return (
    <TableBody>
      {data.map((row, index) => (
        <TableRow 
          key={index}
          className={cn(
            row.isAggregate && "bg-muted font-medium",
            "hover:bg-muted/50 transition-colors"
          )}
        >
          {selectedFields.map((fieldId) => (
            <TableCell 
              key={fieldId}
              className={cn(
                fieldId.startsWith('formula_') && "font-medium",
                row.isAggregate && fieldId.startsWith('formula_') && "text-primary"
              )}
            >
              {formatCellValue(row[fieldId], fieldId)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};