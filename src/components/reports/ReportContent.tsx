import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/types";
import { DateRange } from "react-day-picker";
import { ReportFields } from "./ReportFields";
import { DataPreview } from "./DataPreview";
import { ExportOptions } from "./ExportOptions";
import { FormulaBuilder, ReportFormula } from "./FormulaBuilder";
import { useState, useEffect } from "react";
import { ReportData } from "@/utils/reportGenerator";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  const handleAddFormula = (formula: ReportFormula) => {
    setFormulas(prev => [...prev, formula]);
  };

  const handleApplyFilter = () => {
    console.log('Applying date filter:', filterDateRange);
  };

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSaveTemplate = async () => {
    if (selectedFields.length === 0) {
      toast.error('Please select at least one field');
      return;
    }

    try {
      const { error } = await supabase
        .from('report_templates')
        .insert({
          name: `Report Template ${new Date().toLocaleDateString()}`,
          fields: selectedFields,
          formulas: formulas,
          format: selectedFormat,
        });

      if (error) throw error;
      toast.success('Template saved successfully');
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const loadTemplate = async (template: any) => {
    try {
      setSelectedFormat(template.format);
      setFormulas(template.formulas);
      // Update selected fields through parent component
      template.fields.forEach((field: string) => {
        if (!selectedFields.includes(field)) {
          onFieldToggle(field);
        }
      });
      toast.success('Template loaded successfully');
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    }
  };

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
          <Label>Date Range Filter</Label>
          <div className="flex gap-4 items-end">
            <DatePickerWithRange
              date={filterDateRange}
              setDate={setFilterDateRange}
            />
            <Button onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </div>
        </div>

        <Separator />

        <FormulaBuilder 
          fields={fields}
          onAddFormula={handleAddFormula}
        />

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Preview</h3>
          <DataPreview 
            data={previewData}
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
          onLoadTemplate={loadTemplate}
          isLoadingTemplates={isLoadingTemplates}
        />
      </CardContent>
    </Card>
  );
};