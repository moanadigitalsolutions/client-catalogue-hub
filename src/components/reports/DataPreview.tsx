import { Table } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormField } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DateRange } from "react-day-picker";
import { TableHeader } from "./table/TableHeader";
import { TableContent } from "./table/TableContent";
import { LoadingState } from "./table/LoadingState";
import { NoDataState } from "./table/NoDataState";

interface DataPreviewProps {
  selectedFields: string[];
  fields: FormField[];
  dateRange?: DateRange;
}

interface ClientRow {
  [key: string]: string | number | boolean | null;
  dob?: string;
}

export const DataPreview = ({ selectedFields, fields, dateRange }: DataPreviewProps) => {
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

      return (data as unknown as ClientRow[]).map(row => {
        if (!row) return {};
        
        const newRow = { ...row };
        if (selectedFields.includes('birth_date') && 'dob' in newRow) {
          newRow.birth_date = newRow.dob;
          delete newRow.dob;
        }
        return newRow;
      });
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

  return (
    <ScrollArea className="h-[400px] border rounded-md">
      <Table>
        <TableHeader selectedFields={selectedFields} fields={fields} />
        {isLoading ? (
          <LoadingState colSpan={selectedFields.length} />
        ) : previewData && previewData.length > 0 ? (
          <TableContent data={previewData} selectedFields={selectedFields} />
        ) : (
          <NoDataState colSpan={selectedFields.length} />
        )}
      </Table>
    </ScrollArea>
  );
};