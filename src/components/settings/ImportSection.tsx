import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import * as XLSX from 'xlsx';

export const ImportSection = () => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const parseImportFile = async (file: File) => {
    console.log("Parsing import file:", file.name);
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

  const processImportedData = (data: any[]) => {
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

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    try {
      setIsImporting(true);
      console.log("Starting import process...");
      
      const rawData = await parseImportFile(importFile);
      console.log("Parsed data:", rawData);

      const processedData = processImportedData(rawData);
      console.log("Processed data for import:", processedData);

      const { data: insertedData, error } = await supabase
        .from('clients')
        .insert(processedData)
        .select();

      if (error) {
        console.error("Import error:", error);
        throw error;
      }

      console.log("Successfully imported data:", insertedData);
      toast.success(`Successfully imported ${insertedData.length} records`);
      setImportFile(null);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data. Please ensure the file is in the correct format");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="import">Import Data</Label>
      <div className="flex gap-2">
        <Input
          id="import"
          type="file"
          accept=".xlsx,.xls,.json"
          onChange={(e) => setImportFile(e.target.files?.[0] || null)}
          className="flex-1"
        />
        <Button
          onClick={handleImport}
          disabled={!importFile || isImporting}
          variant="secondary"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isImporting ? 'Importing...' : 'Import'}
        </Button>
      </div>
    </div>
  );
};