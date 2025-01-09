import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/types";
import { DateRange } from "react-day-picker";
import { ReportFields } from "./ReportFields";
import { DataPreview } from "./DataPreview";
import { ExportOptions } from "./ExportOptions";

interface ReportContentProps {
  fields: FormField[];
  selectedFields: string[];
  onFieldToggle: (fieldId: string) => void;
  onSelectAll: () => void;
  dateRange: DateRange | undefined;
  selectedFormat: "pdf" | "excel";
  setSelectedFormat: (format: "pdf" | "excel") => void;
  onExport: (format: "pdf" | "excel") => void;
  onSaveTemplate: () => void;
  isExporting: boolean;
}

export const ReportContent = ({
  fields,
  selectedFields,
  onFieldToggle,
  onSelectAll,
  dateRange,
  selectedFormat,
  setSelectedFormat,
  onExport,
  onSaveTemplate,
  isExporting,
}: ReportContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReportFields
          fields={fields}
          selectedFields={selectedFields}
          onFieldToggle={onFieldToggle}
          onSelectAll={onSelectAll}
        />

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Preview</h3>
          <DataPreview 
            selectedFields={selectedFields}
            fields={fields}
            dateRange={dateRange}
          />
        </div>

        <Separator />

        <ExportOptions
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          onExport={onExport}
          onSaveTemplate={onSaveTemplate}
          disabled={selectedFields.length === 0 || isExporting}
        />
      </CardContent>
    </Card>
  );
};