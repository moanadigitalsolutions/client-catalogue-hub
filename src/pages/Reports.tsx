import { useState } from "react";
import { useFormFields } from "@/hooks/useFormFields";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { generateReport } from "@/utils/reportGenerator";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { ReportContent } from "@/components/reports/ReportContent";
import { ReportFilters } from "@/components/reports/ReportFilters";

const Reports = () => {
  const { fields } = useFormFields();
  const { toast } = useToast();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [groupBy, setGroupBy] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel">("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSelectAll = () => {
    const allFieldIds = fields.map((f) => f.field_id);
    setSelectedFields(allFieldIds);
  };

  const handleExport = async (format: "pdf" | "excel") => {
    if (selectedFields.length === 0) {
      toast({
        title: "No fields selected",
        description: "Please select at least one field to generate the report",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);
      const result = await generateReport(format, {
        fields: selectedFields,
        dateRange: dateRange ? {
          from: dateRange.from!,
          to: dateRange.to!
        } : undefined,
        groupBy,
        sortBy,
        sortOrder,
        searchTerm,
      });

      const url = window.URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: `Your ${format.toUpperCase()} report has been generated successfully`,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveReportTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Your report template has been saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <ReportHeader>
        <ReportFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </ReportHeader>

      <ReportContent
        fields={fields}
        selectedFields={selectedFields}
        onFieldToggle={handleFieldToggle}
        onSelectAll={handleSelectAll}
        dateRange={dateRange}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        onExport={handleExport}
        onSaveTemplate={handleSaveReportTemplate}
        isExporting={isExporting}
      />
    </div>
  );
};

export default Reports;