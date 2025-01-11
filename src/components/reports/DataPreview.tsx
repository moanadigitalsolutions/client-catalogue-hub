import { Card, CardContent } from "@/components/ui/card";
import { TableContent } from "./table/TableContent";
import { ReportData } from "@/utils/reportGenerator";
import { ReportFormula } from "./FormulaBuilder";
import { calculateFormulaResult } from "@/utils/formulaCalculator";

interface DataPreviewProps {
  data: ReportData[];
  displayFields: string[];
  isLoading: boolean;
  formulas?: ReportFormula[];
}

export const DataPreview = ({ data, displayFields, isLoading, formulas = [] }: DataPreviewProps) => {
  console.log('DataPreview received:', { data, displayFields, formulas, isLoading });
  
  // Add formula results to each row
  const enrichedData = data.map(row => {
    const enrichedRow = { ...row };
    formulas?.forEach(formula => {
      enrichedRow[formula.name] = calculateFormulaResult(row, formula);
    });
    return enrichedRow;
  });

  // Combine original fields with formula fields
  const allColumns = [...displayFields, ...(formulas?.map(f => f.name) || [])];
  
  return (
    <Card>
      <CardContent className="p-0">
        <TableContent 
          data={enrichedData} 
          columns={allColumns}
          isLoading={isLoading} 
        />
      </CardContent>
    </Card>
  );
};