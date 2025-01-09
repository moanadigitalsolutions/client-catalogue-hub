import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface LoadingStateProps {
  colSpan: number;
}

export const LoadingState = ({ colSpan }: LoadingStateProps) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center">
          Loading preview data...
        </TableCell>
      </TableRow>
    </TableBody>
  );
};