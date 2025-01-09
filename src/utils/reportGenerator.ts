import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { supabase } from "@/lib/supabase";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportParams {
  fields: string[];
  dateRange?: { from: Date; to: Date };
}

interface ClientData {
  [key: string]: string | number | boolean | null;
  dob?: string;
}

const generateExcel = (data: ClientData[], fields: string[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return { blob, filename: `report-${new Date().toISOString()}.xlsx` };
};

const generatePDF = (data: ClientData[], fields: string[]) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Client Report", 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

  const displayFields = fields.map(field => field === 'birth_date' ? 'dob' : field);
  const tableData = data.map(row => displayFields.map(field => row[field]));
  
  doc.autoTable({
    head: [fields],
    body: tableData,
    startY: 35,
    margin: { top: 30 },
  });

  const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
  return { blob, filename: `report-${new Date().toISOString()}.pdf` };
};

export const generateReport = async (format: "pdf" | "excel", params: ReportParams) => {
  console.log("Generating report with params:", params);
  
  const queryFields = params.fields.map(field => field === 'birth_date' ? 'dob' : field);
  
  let query = supabase
    .from('clients')
    .select(queryFields.join(','));

  if (params.dateRange?.from && params.dateRange?.to) {
    query = query
      .gte('created_at', params.dateRange.from.toISOString())
      .lte('created_at', params.dateRange.to.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching report data:', error);
    throw new Error(`Error fetching report data: ${error.message}`);
  }

  if (!data || !Array.isArray(data)) {
    throw new Error('No data returned from query');
  }

  const mappedData = (data as unknown as ClientData[]).map((row: ClientData) => {
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