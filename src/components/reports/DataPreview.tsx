import { Card, CardContent } from "@/components/ui/card";
import { TableContent } from "./table/TableContent";
import { ReportData } from "@/utils/reportGenerator";
import { ReportFormula } from "./FormulaBuilder";
import { calculateFormulaResult } from "@/utils/formulaCalculator";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, parseISO } from "date-fns";

interface DataPreviewProps {
  data: ReportData[];
  displayFields: string[];
  isLoading: boolean;
  formulas?: ReportFormula[];
  dateRange?: DateRange;
}

export const DataPreview = ({ data, displayFields, isLoading, formulas = [], dateRange }: DataPreviewProps) => {
  console.log('DataPreview received:', { data, displayFields, formulas, isLoading, dateRange });
  
  // Filter data by client creation date if date range is provided
  const filteredData = dateRange?.from 
    ? data.filter(row => {
        const creationDate = parseISO(row.created_at as string);
        const fromDate = startOfDay(dateRange.from!);
        const toDate = dateRange.to ? endOfDay(dateRange.to) : undefined;
        
        return toDate 
          ? creationDate >= fromDate && creationDate <= toDate
          : creationDate >= fromDate;
      })
    : data;

  // Add formula results to each row
  const enrichedData = filteredData.map(row => {
    const enrichedRow = { ...row };
    formulas?.forEach(formula => {
      enrichedRow[formula.name] = calculateFormulaResult(row, formula);
    });
    return enrichedRow;
  });

  // Add totals row for formulas
  const totalsRow = formulas?.length ? {
    ...Object.fromEntries(displayFields.map(field => [field, ''])),
    ...Object.fromEntries(formulas.map(formula => {
      const total = enrichedData.reduce((sum, row) => sum + (Number(row[formula.name]) || 0), 0);
      return [formula.name, total];
    })),
    isTotal: true
  } : null;

  // Combine original fields with formula fields
  const allColumns = [...displayFields, ...(formulas?.map(f => f.name) || [])];
  
  // Add totals row if we have formulas
  const finalData = totalsRow 
    ? [...enrichedData, totalsRow]
    : enrichedData;

  console.log('Filtered and enriched data:', finalData);

  return (
    <Card>
      <CardContent className="p-0">
        <TableContent 
          data={finalData} 
          columns={allColumns}
          isLoading={isLoading} 
        />
      </CardContent>
    </Card>
  );
};