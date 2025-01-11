import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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
  
  // Get sample data for now - in a real app, this would come from your backend
  const data = generatePreviewData(options.fields);
  
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

// Generate preview data
export const generatePreviewData = (fields: string[]): ReportData[] => {
  console.log('Generating preview data for fields:', fields);
  
  const sampleData = [
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      dob: "1990-01-01",
      street: "123 Main St",
      city: "New York",
      postcode: "10001",
      notes: "Some notes about John",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+0987654321",
      dob: "1985-05-15",
      street: "456 Park Ave",
      city: "Los Angeles",
      postcode: "90001",
      notes: "Some notes about Jane",
    }
  ];

  return sampleData.map(record => {
    const filteredRecord: ReportData = {};
    fields.forEach(field => {
      if (field in record) {
        filteredRecord[field] = record[field];
      }
    });
    return filteredRecord;
  });
};