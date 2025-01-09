import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Function to generate a PDF report
export const generatePDFReport = (data: any[], title: string) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text(title, 14, 22);
  doc.autoTable({
    head: [['Column 1', 'Column 2', 'Column 3']],
    body: data.map(item => [item.col1, item.col2, item.col3]),
  });
  doc.save(`${title}.pdf`);
};

// Function to generate an Excel report
export const generateExcelReport = (data: any[], title: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  XLSX.writeFile(workbook, `${title}.xlsx`);
};
