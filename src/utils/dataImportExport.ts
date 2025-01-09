import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { supabase } from "@/lib/supabase";

export const processImportedData = (data: any[]) => {
  return data.map((record: any) => {
    // Remove the 'id' field if it's 'auto-generated' or exists
    const { id, ...clientData } = record;
    
    // Convert any empty strings to null for optional fields
    Object.keys(clientData).forEach(key => {
      if (clientData[key] === '') {
        clientData[key] = null;
      }
    });

    return clientData;
  });
};

export const importDataToSupabase = async (processedData: any[]) => {
  const { data: insertedData, error } = await supabase
    .from('clients')
    .insert(processedData)
    .select();

  if (error) {
    console.error("Import error:", error);
    throw error;
  }

  return insertedData;
};

export const parseImportFile = async (file: File) => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExt === 'xlsx' || fileExt === 'xls') {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(firstSheet);
  } else if (fileExt === 'json') {
    const text = await file.text();
    return JSON.parse(text);
  } else {
    throw new Error('Unsupported file format');
  }
};