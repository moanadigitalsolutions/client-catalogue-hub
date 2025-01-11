import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";

export interface ReportData {
  [key: string]: string | number | boolean | null;
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

const generatePDF = (data: ReportData[], fields: string[]): Blob => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text("Report", 14, 15);
  doc.setFontSize(10);
  
  // Generate table data
  const headers = fields;
  const rows = data.map(row => 
    fields.map(field => formatValue(row[field], field))
  );

  // Add table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 25,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
    },
  });

  return doc.output('blob');
};

const generateExcel = (data: ReportData[], fields: string[]): Blob => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Format data for Excel
  const excelData = data.map(row => {
    const formattedRow: { [key: string]: string } = {};
    fields.forEach(field => {
      formattedRow[field] = formatValue(row[field], field);
    });
    return formattedRow;
  });
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  
  // Generate blob
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const generateReport = async (format: "pdf" | "excel", options: ReportOptions) => {
  console.log('Generating report with options:', options);
  
  // Get real data from the database
  const data = await fetchReportData(options.fields, options.dateRange);
  
  let blob: Blob;
  let filename: string;
  
  if (format === "pdf") {
    blob = generatePDF(data, options.fields);
    filename = `report_${format}_${new Date().toISOString()}.pdf`;
  } else {
    blob = generateExcel(data, options.fields);
    filename = `report_${format}_${new Date().toISOString()}.xlsx`;
  }
  
  return { blob, filename };
};

// Fetch real data from Supabase
const fetchReportData = async (fields: string[], dateRange?: { from: Date; to: Date }): Promise<ReportData[]> => {
  console.log('Fetching report data for fields:', fields);
  
  try {
    let query = supabase
      .from('clients')
      .select(fields.join(','));

    // Add date range filter if provided
    if (dateRange) {
      query = query.gte('created_at', dateRange.from.toISOString())
                  .lte('created_at', dateRange.to.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching report data:', error);
      throw error;
    }

    // Ensure we return an array that matches ReportData type
    return (data || []) as ReportData[];
  } catch (error) {
    console.error('Error in fetchReportData:', error);
    return [];
  }
};

// Generate preview data from real database
export const generatePreviewData = async (fields: string[]): Promise<ReportData[]> => {
  console.log('Generating preview data for fields:', fields);
  return await fetchReportData(fields);
};