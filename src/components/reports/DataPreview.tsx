import { Card, CardContent } from "@/components/ui/card";
import { TableContent } from "./table/TableContent";
import { ReportData } from "@/utils/reportGenerator";
import { ReportFormula } from "./FormulaBuilder";
import { calculateFormulaResult } from "@/utils/formulaCalculator";
import { DateRange } from "react-day-picker";

interface DataPreviewProps {
  data: ReportData[];
  displayFields: string[];
  isLoading: boolean;
  formulas?: ReportFormula[];
  dateRange?: DateRange;
}

export const DataPreview = ({ 
  data, 
  displayFields, 
  isLoading, 
  formulas = [], 
  dateRange 
}: DataPreviewProps) => {
  console.log('DataPreview received:', { data, displayFields, formulas, isLoading, dateRange });

  // Add formula results to each row
  const enrichedData = data.map(row => {
    const enrichedRow = { ...row };
    formulas?.forEach(formula => {
      enrichedRow[formula.name] = calculateFormulaResult(row, formula);
    });
    return enrichedRow;
  });

  console.log('Enriched data:', enrichedData);

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

  console.log('Final data to display:', finalData);

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