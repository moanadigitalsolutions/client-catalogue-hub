import { useState } from "react";
import { useFormFields } from "@/hooks/useFormFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, FileText, Download, Filter } from "lucide-react";
import { FormField } from "@/types";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Reports = () => {
  const { fields } = useFormFields();
  const { toast } = useToast();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [groupBy, setGroupBy] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel">("pdf");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
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

    // Mock export functionality with enhanced parameters
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
    // Mock saving report template
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
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={setDateRange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Group By</Label>
                  <Select value={groupBy} onValueChange={setGroupBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city">City</SelectItem>
                      <SelectItem value="qualification">Qualification</SelectItem>
                      <SelectItem value="created_at">Creation Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sorting field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="created_at">Creation Date</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Select
                    value={sortOrder}
                    onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    placeholder="Search in results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Select Fields</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFields(fields.map((f) => f.id))}
              >
                Select All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map((field: FormField) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => handleFieldToggle(field.id)}
                  />
                  <label
                    htmlFor={field.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Export Options</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveReportTemplate}
              >
                Save as Template
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Select
                value={selectedFormat}
                onValueChange={(value: "pdf" | "excel") =>
                  setSelectedFormat(value)
                }
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
                onClick={() => handleExport(selectedFormat)}
                disabled={selectedFields.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

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