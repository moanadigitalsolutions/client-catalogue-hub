import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { supabase } from "@/lib/supabase";

export const ExportSection = () => {
  const handleExport = async () => {
    try {
      console.log("Starting data export...");
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*');

      if (error) throw error;

      const dataStr = JSON.stringify(clients, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'client-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("Data exported successfully");
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const handleTemplateDownload = async () => {
    try {
      console.log("Generating Excel template...");
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .limit(1);

      if (error) throw error;

      const template = clients && clients[0] ? 
        Object.keys(clients[0]).reduce((acc, key) => {
          acc[key] = key === 'id' ? 'auto-generated' : '';
          return acc;
        }, {} as Record<string, string>) : {};

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([template], {
        header: Object.keys(template),
      });

      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z1');
      for (let col = range.s.c; col <= range.e.c; col++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws[addr]) continue;
        ws[addr].s = {
          fill: { fgColor: { rgb: "FFFF00" } },
          font: { bold: true }
        };
      }

      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, 'client-template.xlsx');
      
      console.log("Template downloaded successfully");
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("Failed to download template");
    }
  };

  return (
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
  );
};