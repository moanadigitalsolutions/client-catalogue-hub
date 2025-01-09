import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface NoDataStateProps {
  colSpan: number;
  message?: string;
}

export const NoDataState = ({ colSpan, message = "No data available" }: NoDataStateProps) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center">
          {message}
        </TableCell>
      </TableRow>
    </TableBody>
  );
};