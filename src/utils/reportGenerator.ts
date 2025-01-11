import { format } from "date-fns";

export interface ReportData {
  [key: string]: string | number | boolean;
  dob?: string;
}

export interface ReportOptions {
  fields: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export const formatValue = (value: any, fieldType: string) => {
  if (value === null || value === undefined) return '';

  // Handle date fields
  if (fieldType === 'birth_date' || fieldType === 'dob' || fieldType === 'date') {
    try {
      return format(new Date(value), 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return value;
    }
  }

  // Handle boolean fields
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // Handle array fields
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  // Handle currency fields
  if (fieldType === 'currency' && typeof value === 'number') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  return String(value);
};

export const generateReport = async (format: "pdf" | "excel", options: ReportOptions) => {
  // Mock implementation for now
  const mockBlob = new Blob(['Sample report content'], { type: 'text/plain' });
  return {
    blob: mockBlob,
    filename: `report.${format}`
  };
};