import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { parseImportFile, processImportedData, importDataToSupabase } from "@/utils/dataImportExport";

export const ImportSection = () => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    try {
      setIsImporting(true);
      const data = await parseImportFile(importFile);
      console.log("Importing data:", data);

      const processedData = processImportedData(data);
      const insertedData = await importDataToSupabase(processedData);

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