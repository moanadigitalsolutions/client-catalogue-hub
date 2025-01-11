import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useFormFields } from "@/hooks/useFormFields";
import { formatValue } from "@/utils/reportGenerator";

interface TableContentProps {
  data: any[];
  columns: string[];
}

export const TableContent = ({ data, columns }: TableContentProps) => {
  const { fields } = useFormFields();

  return (
    <TableBody>
      {data.map((row, index) => (
        <TableRow key={index}>
          {columns.map((column) => {
            const field = fields?.find((f) => f.field_id === column);
            return (
              <TableCell key={column}>
                {formatValue(row[column], field?.type || column)}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
};