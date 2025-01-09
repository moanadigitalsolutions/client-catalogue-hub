import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormField } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface DataPreviewProps {
  selectedFields: string[];
  fields: FormField[];
  dateRange?: { from: Date; to: Date };
}

export const DataPreview = ({ selectedFields, fields, dateRange }: DataPreviewProps) => {
  const { data: previewData, isLoading } = useQuery({
    queryKey: ['preview-data', selectedFields, dateRange],
    queryFn: async () => {
      console.log("Fetching preview data with fields:", selectedFields);
      if (selectedFields.length === 0) return [];

      let query = supabase
        .from('clients')
        .select(selectedFields.join(','))
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

      return data || [];
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

  const getFieldLabel = (fieldId: string) => {
    const field = fields.find(f => f.field_id === fieldId);
    return field?.label || fieldId;
  };

  return (
    <ScrollArea className="h-[400px] border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {selectedFields.map((fieldId) => (
              <TableHead key={fieldId}>{getFieldLabel(fieldId)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={selectedFields.length} className="text-center">
                Loading preview data...
              </TableCell>
            </TableRow>
          ) : previewData && previewData.length > 0 ? (
            previewData.map((row, index) => (
              <TableRow key={index}>
                {selectedFields.map((fieldId) => (
                  <TableCell key={fieldId}>
                    {row[fieldId] !== null ? String(row[fieldId]) : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={selectedFields.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};