import { Table } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormField } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DateRange } from "react-day-picker";
import { ReportTableHeader } from "./table/TableHeader";
import { TableContent } from "./table/TableContent";
import { LoadingState } from "./table/LoadingState";
import { NoDataState } from "./table/NoDataState";
import { ReportFormula } from "./FormulaBuilder";

interface DataPreviewProps {
  selectedFields: string[];
  fields: FormField[];
  dateRange?: DateRange;
  formulas?: ReportFormula[];
}

interface ClientRow {
  [key: string]: string | number | boolean | null;
  dob?: string;
}

const calculateFormulaValue = (formula: ReportFormula, row: ClientRow): number => {
  const fieldValues = formula.fields.map(field => {
    const value = row[field];
    // Handle currency values stored as strings
    if (typeof value === 'string' && value.includes('$')) {
      return parseFloat(value.replace(/[$,]/g, '')) || 0;
    }
    return Number(value) || 0;
  });
  
  switch (formula.operation) {
    case "sum":
      return fieldValues[0];
    case "multiply":
      return fieldValues.reduce((a, b) => a * b, 1);
    case "divide":
      return fieldValues[1] !== 0 ? fieldValues[0] / fieldValues[1] : 0;
    case "subtract":
      return fieldValues[0] - (fieldValues[1] || 0);
    case "average":
      return fieldValues[0];
    case "count":
      return fieldValues[0] !== 0 ? 1 : 0;
    default:
      return 0;
  }
};

const calculateAggregateValue = (formula: ReportFormula, data: ClientRow[]): number => {
  const values = data.map(row => calculateFormulaValue(formula, row));
  
  switch (formula.operation) {
    case "average":
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    case "count":
      return values.filter(v => v !== 0).length;
    default:
      return values.reduce((a, b) => a + b, 0);
  }
};

export const DataPreview = ({ selectedFields, fields, dateRange, formulas = [] }: DataPreviewProps) => {
  const { data: previewData, isLoading } = useQuery({
    queryKey: ['preview-data', selectedFields, dateRange],
    queryFn: async () => {
      console.log("Fetching preview data with fields:", selectedFields);
      if (selectedFields.length === 0) return [];

      const mappedFields = selectedFields.map(field => field === 'birth_date' ? 'dob' : field);
      console.log("Mapped fields for query:", mappedFields);

      let query = supabase
        .from('clients')
        .select(mappedFields.join(','))
        .limit(20);

      if (dateRange?.from && dateRange?.to) {
        query = query
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching preview data:', error);
        throw error;
      }

      if (!data) return [];

      const processedData = (data as unknown as ClientRow[]).map(row => {
        if (!row) return {};
        
        const newRow = { ...row };
        if (selectedFields.includes('birth_date') && 'dob' in newRow) {
          newRow.birth_date = newRow.dob;
          delete newRow.dob;
        }

        // Calculate individual row formula results
        formulas.forEach(formula => {
          newRow[`formula_${formula.name}`] = calculateFormulaValue(formula, newRow);
        });

        return newRow;
      });

      // Calculate aggregate formula results
      formulas.forEach(formula => {
        const aggregateValue = calculateAggregateValue(formula, processedData);
        processedData.push({
          ...Object.fromEntries(selectedFields.map(field => [field, ''])),
          [`formula_${formula.name}`]: aggregateValue,
          isAggregate: true,
        });
      });

      return processedData;
    },
    enabled: selectedFields.length > 0,
  });

  if (selectedFields.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Select fields to preview data
      </div>
    );
  }

  // Add formula fields to the display fields
  const displayFields = [
    ...selectedFields,
    ...formulas.map(f => `formula_${f.name}`)
  ];

  // Add formula fields to the form fields list
  const allFields = [
    ...fields,
    ...formulas.map(f => ({
      id: `formula_${f.name}`,
      field_id: `formula_${f.name}`,
      label: f.name,
      type: "number" as const,
      required: false,
      order_index: 0
    }))
  ];

  return (
    <ScrollArea className="h-[400px] border rounded-md">
      <Table>
        <ReportTableHeader selectedFields={displayFields} fields={allFields} />
        {isLoading ? (
          <LoadingState colSpan={displayFields.length} />
        ) : previewData && previewData.length > 0 ? (
          <TableContent data={previewData} columns={displayFields} />
        ) : (
          <NoDataState colSpan={displayFields.length} />
        )}
      </Table>
    </ScrollArea>
  );
};