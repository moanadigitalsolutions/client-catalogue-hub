import { useState } from "react";
import { useFormFields } from "@/hooks/useFormFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ReportFields } from "@/components/reports/ReportFields";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ExportOptions } from "@/components/reports/ExportOptions";

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

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(fields.map((f) => f.id));
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

    console.log("Exporting report with parameters:", {
      format,
      fields: selectedFields,
      dateRange,
      groupBy,
      sortBy,
      sortOrder,
      searchTerm,
    });

    toast({
      title: "Report Generated",
      description: `Your ${format.toUpperCase()} report has been generated successfully`,
    });
  };

  const handleSaveReportTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Your report template has been saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Report Filters</SheetTitle>
                <SheetDescription>
                  Configure your report filters and parameters
                </SheetDescription>
              </SheetHeader>
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
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ReportFields
            fields={fields}
            selectedFields={selectedFields}
            onFieldToggle={handleFieldToggle}
            onSelectAll={handleSelectAll}
          />

          <Separator />

          <ExportOptions
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            onExport={handleExport}
            onSaveTemplate={handleSaveReportTemplate}
            disabled={selectedFields.length === 0}
          />

          <Separator />

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Selected Fields Preview</h4>
            <div className="flex flex-wrap gap-2">
              {selectedFields.length > 0 ? (
                selectedFields.map((fieldId) => {
                  const field = fields.find((f) => f.id === fieldId);
                  return (
                    <span
                      key={fieldId}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                    >
                      {field?.label}
                    </span>
                  );
                })
              ) : (
                <span className="text-muted-foreground text-sm">
                  No fields selected
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;