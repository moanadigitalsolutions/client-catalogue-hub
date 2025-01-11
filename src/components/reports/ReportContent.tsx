import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/types";
import { DateRange } from "react-day-picker";
import { ReportFields } from "./ReportFields";
import { DataPreview } from "./DataPreview";
import { ExportOptions } from "./ExportOptions";
import { ReportFormula } from "./FormulaBuilder";
import { ReportData } from "@/utils/reportGenerator";
import { DateRangeFilter } from "./filters/DateRangeFilter";
import { filterDataByDateRange } from "@/utils/dateFilters";
import { FormulaSection } from "./sections/FormulaSection";
import { TemplateSection } from "./sections/TemplateSection";

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
  previewData: ReportData[];
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
  previewData,
}: ReportContentProps) => {
  const [formulas, setFormulas] = useState<ReportFormula[]>([]);
  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>();
  const [filteredData, setFilteredData] = useState<ReportData[]>(previewData);

  const handleAddFormula = (formula: ReportFormula) => {
    setFormulas(prev => [...prev, formula]);
  };

  // Update filtered data when previewData changes
  useEffect(() => {
    setFilteredData(previewData);
  }, [previewData]);

  const handleApplyFilter = () => {
    console.log('Applying date filter:', filterDateRange);
    const filtered = filterDataByDateRange(previewData, filterDateRange);
    console.log('Filtered data:', filtered);
    setFilteredData(filtered);
  };

  const { templates, isLoadingTemplates, handleSaveTemplate } = TemplateSection({
    selectedFields,
    formulas,
    selectedFormat,
    onLoadTemplate: (template) => {
      setSelectedFormat(template.format);
      setFormulas(template.formulas);
      template.fields.forEach((field: string) => {
        if (!selectedFields.includes(field)) {
          onFieldToggle(field);
        }
      });
    }
  });

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

        <DateRangeFilter
          filterDateRange={filterDateRange}
          setFilterDateRange={setFilterDateRange}
          onApplyFilter={handleApplyFilter}
        />

        <FormulaSection 
          fields={fields}
          onAddFormula={handleAddFormula}
        />

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Preview</h3>
          <DataPreview 
            data={filteredData}
            displayFields={selectedFields}
            formulas={formulas}
            isLoading={isExporting}
            dateRange={filterDateRange}
          />
        </div>

        <Separator />

        <ExportOptions
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          onExport={onExport}
          onSaveTemplate={handleSaveTemplate}
          disabled={selectedFields.length === 0 || isExporting}
          templates={templates}
          onLoadTemplate={(template) => {
            setSelectedFormat(template.format);
            setFormulas(template.formulas);
            template.fields.forEach((field: string) => {
              if (!selectedFields.includes(field)) {
                onFieldToggle(field);
              }
            });
          }}
          isLoadingTemplates={isLoadingTemplates}
        />
      </CardContent>
    </Card>
  );
};