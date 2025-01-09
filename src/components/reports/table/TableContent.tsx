import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TableContentProps {
  data: any[];
  selectedFields: string[];
}

export const TableContent = ({ data, selectedFields }: TableContentProps) => {
  return (
    <TableBody>
      {data.map((row, index) => (
        <TableRow key={index}>
          {selectedFields.map((fieldId) => (
            <TableCell key={fieldId}>
              {row[fieldId] !== null ? String(row[fieldId]) : ''}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};