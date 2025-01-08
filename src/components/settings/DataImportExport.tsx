import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Upload, FileDown } from "lucide-react";
import { mockClients } from "@/utils/nzData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export const DataImportExport = () => {
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleExport = () => {
    try {
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
      const text = await importFile.text();
      const data = JSON.parse(text);
      console.log("Imported data:", data);
      toast.success("Data imported successfully");
      setImportFile(null);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data. Please ensure the file is in the correct JSON format");
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

      // Create a template object with empty values
      const template = clients && clients[0] ? 
        Object.keys(clients[0]).reduce((acc, key) => {
          acc[key] = key === 'id' ? 'auto-generated' : '';
          return acc;
        }, {} as Record<string, string>) : {};

      const templateStr = JSON.stringify([template], null, 2);
      const blob = new Blob([templateStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'client-template.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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
              <li>Only JSON files are supported (.json)</li>
              <li>Download the template first to see the required format</li>
              <li>The ID field will be auto-generated for new records</li>
              <li>Make sure all required fields are filled</li>
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
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
              <Button
                onClick={handleImport}
                disabled={!importFile}
                variant="secondary"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Export & Templates</Label>
            <div className="flex gap-2">
              <Button onClick={handleTemplateDownload} variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Download Template
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