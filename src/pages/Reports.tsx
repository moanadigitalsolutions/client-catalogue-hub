import { useState } from "react";
import { useFormFields } from "@/hooks/useFormFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { FormField } from "@/types";

const Reports = () => {
  const { fields } = useFormFields();
  const { toast } = useToast();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

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

    // Mock export functionality - in real implementation, this would call an API
    console.log(`Exporting ${format} report with fields:`, selectedFields);
    
    toast({
      title: "Report Generated",
      description: `Your ${format.toUpperCase()} report has been generated successfully`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Fields</h3>
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

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Export Options</h3>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => handleExport("pdf")}
                disabled={selectedFields.length === 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
              <Button
                onClick={() => handleExport("excel")}
                disabled={selectedFields.length === 0}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </Button>
            </div>
          </div>

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