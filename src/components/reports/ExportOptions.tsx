import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface ExportOptionsProps {
  selectedFormat: "pdf" | "excel";
  setSelectedFormat: (format: "pdf" | "excel") => void;
  onExport: (format: "pdf" | "excel") => void;
  onSaveTemplate: () => void;
  disabled: boolean;
  templates: any[];
  onLoadTemplate: (template: any) => void;
  isLoadingTemplates: boolean;
}

export const ExportOptions = ({
  selectedFormat,
  setSelectedFormat,
  onExport,
  onSaveTemplate,
  disabled,
  templates,
  onLoadTemplate,
  isLoadingTemplates,
}: ExportOptionsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Export Options</h3>
        <Button variant="outline" size="sm" onClick={onSaveTemplate}>
          <Save className="mr-2 h-4 w-4" />
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

      {templates.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Saved Templates</h4>
          <Card className="p-4">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onLoadTemplate(template)}
                    disabled={isLoadingTemplates}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
};