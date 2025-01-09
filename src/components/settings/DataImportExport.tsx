import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Upload, FileDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import * as XLSX from 'xlsx';
import { mockClients } from "@/utils/nzData";

export const DataImportExport = () => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    try {
      // Keep JSON export for backward compatibility
      const dataStr = JSON.stringify(mockClients, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'client-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    try {
      setIsImporting(true);
      const fileExt = importFile.name.split('.').pop()?.toLowerCase();
      let data;

      if (fileExt === 'xlsx' || fileExt === 'xls') {
        const buffer = await importFile.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(firstSheet);
      } else if (fileExt === 'json') {
        const text = await importFile.text();
        data = JSON.parse(text);
      } else {
        throw new Error('Unsupported file format');
      }

      console.log("Importing data:", data);

      // Process and insert each record
      const processedData = data.map((record: any) => {
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

  const handleTemplateDownload = async () => {
    try {
      // Fetch the current table structure from the database
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .limit(1);

      if (error) throw error;

      // Create a template object with empty values but keep headers
      const template = clients && clients[0] ? 
        Object.keys(clients[0]).reduce((acc, key) => {
          acc[key] = key === 'id' ? 'auto-generated' : '';
          return acc;
        }, {} as Record<string, string>) : {};

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([template], {
        header: Object.keys(template),
      });

      // Add some styling to the header row
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z1');
      for (let col = range.s.c; col <= range.e.c; col++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws[addr]) continue;
        ws[addr].s = {
          fill: { fgColor: { rgb: "FFFF00" } },
          font: { bold: true }
        };
      }

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Template");

      // Generate Excel file
      XLSX.writeFile(wb, 'client-template.xlsx');
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("Failed to download template");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Import/Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              <li>Excel files (.xlsx, .xls) and JSON files are supported</li>
              <li>Download the Excel template to see the required format</li>
              <li>The ID field will be auto-generated for new records</li>
              <li>Make sure all required fields are filled</li>
              <li>Do not modify the header row in the Excel template</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
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

          <div className="grid gap-2">
            <Label>Export & Templates</Label>
            <div className="flex gap-2">
              <Button onClick={handleTemplateDownload} variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Download Excel Template
              </Button>
              <Button onClick={handleExport} variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};