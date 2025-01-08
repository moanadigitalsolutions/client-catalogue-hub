import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";

interface ExportOptionsProps {
  selectedFormat: "pdf" | "excel";
  setSelectedFormat: (format: "pdf" | "excel") => void;
  onExport: (format: "pdf" | "excel") => void;
  onSaveTemplate: () => void;
  disabled: boolean;
}

export const ExportOptions = ({
  selectedFormat,
  setSelectedFormat,
  onExport,
  onSaveTemplate,
  disabled,
}: ExportOptionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Export Options</h3>
        <Button variant="outline" size="sm" onClick={onSaveTemplate}>
          Save as Template
        </Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Select
          value={selectedFormat}
          onValueChange={(value: "pdf" | "excel") => setSelectedFormat(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF Format</SelectItem>
            <SelectItem value="excel">Excel Format</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => onExport(selectedFormat)}
          disabled={disabled}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
};