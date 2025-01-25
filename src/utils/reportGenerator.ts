import { supabase } from '@/lib/supabase';
import { DateRange } from "react-day-picker";

export interface ReportData {
  id: string;
  created_at: string | Date;
  [key: string]: string | number | boolean | Date;
}

interface ReportFilters {
  fields?: string[];
  dateRange?: DateRange;
}

export const formatValue = (value: any, fieldName: string): string => {
  if (value === null || value === undefined) return '';
  
  if (fieldName === 'created_at' && (typeof value === 'string' || value instanceof Date)) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString();
  }
  
  return String(value);
};

export const generatePreviewData = async (
  fields: string[],
  dateRange?: DateRange
): Promise<ReportData[]> => {
  try {
    let query = supabase.from('clients').select('*');

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

    return (data || []) as ReportData[];
  } catch (error) {
    console.error('Error in generatePreviewData:', error);
    return [];
  }
};

export const generateReport = async (
  format: "pdf" | "excel",
  filters: ReportFilters
): Promise<{ blob: Blob; filename: string }> => {
  try {
    const data = await generatePreviewData(filters.fields || [], filters.dateRange);
    
    // For now, just return a simple text file
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'text/plain' });
    const filename = `report-${new Date().toISOString()}.${format}`;
    
    return { blob, filename };
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};