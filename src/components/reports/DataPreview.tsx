import { Card, CardContent } from "@/components/ui/card";
import { TableContent } from "./table/TableContent";
import { ReportData } from "@/utils/reportGenerator";
import { ReportFormula } from "./FormulaBuilder";
import { calculateFormulaResult } from "@/utils/formulaCalculator";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, parseISO, isValid, parse } from "date-fns";

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
        // Skip rows without created_at date
        if (!row.created_at) {
          console.log('Skipping row without created_at:', row);
          return false;
        }

        try {
          // Parse the date assuming DD-MM-YYYY format
          const creationDate = parse(row.created_at.toString(), 'dd-MM-yyyy', new Date());
          
          if (!isValid(creationDate)) {
            // Try parsing as ISO format as fallback
            const isoDate = parseISO(row.created_at.toString());
            if (!isValid(isoDate)) {
              console.log('Invalid date format for row:', row);
              return false;
            }
            console.log('Parsed ISO date:', isoDate);
            return handleDateComparison(isoDate, dateRange);
          }

          console.log('Parsed DD-MM-YYYY date:', creationDate);
          return handleDateComparison(creationDate, dateRange);
        } catch (error) {
          console.error('Error parsing date for row:', row, error);
          return false;
        }
      })
    : data;

  console.log('Filtered data:', filteredData);

  // Add formula results to each row
  const enrichedData = filteredData.map(row => {
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

// Helper function to handle date comparison
const handleDateComparison = (date: Date, dateRange: DateRange) => {
  const fromDate = startOfDay(dateRange.from!);
  const toDate = dateRange.to ? endOfDay(dateRange.to) : undefined;
  
  console.log('Comparing dates:', {
    date: date.toISOString(),
    fromDate: fromDate.toISOString(),
    toDate: toDate?.toISOString()
  });
  
  const isInRange = toDate 
    ? date >= fromDate && date <= toDate
    : date >= fromDate;

  if (!isInRange) {
    console.log('Row outside date range:', { 
      date: date.toISOString(), 
      fromDate: fromDate.toISOString(), 
      toDate: toDate?.toISOString() 
    });
  } else {
    console.log('Row within date range:', {
      date: date.toISOString()
    });
  }
  
  return isInRange;
};