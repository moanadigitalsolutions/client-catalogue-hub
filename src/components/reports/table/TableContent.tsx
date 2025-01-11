import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReportData, formatValue } from "@/utils/reportGenerator";
import { LoadingState } from "./LoadingState";
import { NoDataState } from "./NoDataState";

interface TableContentProps {
  data: ReportData[];
  columns: string[];
  isLoading?: boolean;
}

export const TableContent = ({ data, columns, isLoading }: TableContentProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!data || data.length === 0) {
    return <NoDataState />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column}>
                  {formatValue(row[column], column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};