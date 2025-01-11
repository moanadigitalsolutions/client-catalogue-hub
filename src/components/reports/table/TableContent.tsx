import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFormFields } from "@/hooks/useFormFields";
import { formatValue } from "@/utils/reportGenerator";

interface TableContentProps {
  data: any[];
  columns: string[];
}

export const TableContent = ({ data, columns }: TableContentProps) => {
  const { fields } = useFormFields();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const field = fields?.find((f) => f.field_id === column);
              return (
                <TableHead key={column}>
                  {field?.label || column}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => {
                const field = fields?.find((f) => f.field_id === column);
                return (
                  <TableCell key={column}>
                    {formatValue(row[column], field?.type)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};