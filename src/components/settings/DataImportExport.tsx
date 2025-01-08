import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";
import { mockClients } from "@/utils/nzData";

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
      toast.error("Failed to import data");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Import/Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
            <Label>Export Data</Label>
            <Button onClick={handleExport} variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Export All Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};