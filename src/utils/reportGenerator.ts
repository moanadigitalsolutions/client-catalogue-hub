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
  console.log('Generating report with options:', options);
  // Mock implementation for now
  const mockBlob = new Blob(['Sample report content'], { type: 'text/plain' });
  return {
    blob: mockBlob,
    filename: `report.${format}`
  };
};

// Add mock data generation for preview
export const generatePreviewData = (fields: string[]): ReportData[] => {
  console.log('Generating preview data for fields:', fields);
  // Generate some sample data for preview
  return [
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      dob: "1990-01-01",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+0987654321",
      dob: "1985-05-15",
    }
  ].map(record => {
    const filteredRecord: ReportData = {};
    fields.forEach(field => {
      if (field in record) {
        filteredRecord[field] = record[field];
      }
    });
    return filteredRecord;
  });
};