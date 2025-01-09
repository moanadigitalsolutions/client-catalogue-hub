import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { supabase } from "@/lib/supabase";
import { SupabaseClient } from '@supabase/supabase-js';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportParams {
  fields: string[];
  dateRange?: { from: Date; to: Date };
  groupBy?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
}

interface ClientData {
  [key: string]: string | number | boolean | null;
  dob?: string;
}

const generateExcel = (data: ClientData[], fields: string[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  
  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Convert to Blob
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return { blob, filename: `report-${new Date().toISOString()}.xlsx` };
};

const generatePDF = (data: ClientData[], fields: string[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text("Client Report", 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

  // Map birth_date to dob for display
  const displayFields = fields.map(field => field === 'birth_date' ? 'dob' : field);
  const tableData = data.map(row => displayFields.map(field => row[field]));
  
  // Generate table
  doc.autoTable({
    head: [fields],
    body: tableData,
    startY: 35,
    margin: { top: 30 },
  });

  // Convert to blob
  const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
  return { blob, filename: `report-${new Date().toISOString()}.pdf` };
};

export const generateReport = async (format: "pdf" | "excel", params: ReportParams) => {
  console.log("Generating report with params:", params);
  
  // Map birth_date to dob for database query
  const queryFields = params.fields.map(field => field === 'birth_date' ? 'dob' : field);
  
  // Fetch data from Supabase based on selected fields
  let query = supabase
    .from('clients')
    .select(queryFields.join(','));

  // Apply date range filter if provided
  if (params.dateRange?.from && params.dateRange?.to) {
    query = query.gte('created_at', params.dateRange.from.toISOString())
                .lte('created_at', params.dateRange.to.toISOString());
  }

  // Apply search filter if provided
  if (params.searchTerm) {
    query = query.ilike('name', `%${params.searchTerm}%`);
  }

  // Apply sorting
  if (params.sortBy) {
    const sortField = params.sortBy === 'birth_date' ? 'dob' : params.sortBy;
    query = query.order(sortField, { ascending: params.sortOrder === 'asc' });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching report data:', error);
    throw new Error(`Error fetching report data: ${error.message}`);
  }

  if (!data || !Array.isArray(data)) {
    throw new Error('No data returned from query');
  }

  // Map dob back to birth_date in the results if needed
  const mappedData = (data as ClientData[]).map((row: ClientData) => {
    if (!row) return {};
    
    const newRow = { ...row };
    if (params.fields.includes('birth_date') && newRow.dob) {
      newRow.birth_date = newRow.dob;
      delete newRow.dob;
    }
    return newRow;
  });

  if (format === "excel") {
    return generateExcel(mappedData, params.fields);
  } else {
    return generatePDF(mappedData, params.fields);
  }
};