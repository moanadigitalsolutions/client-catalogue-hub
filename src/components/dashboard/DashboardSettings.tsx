import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormFields } from "@/hooks/useFormFields";
import { useState } from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GraphConfig {
  field: string;
  secondaryField?: string;
  type: string;
  title: string;
  analysisType: string;
}

const ANALYSIS_TYPES = {
  text: [
    { value: "frequency", label: "Word Frequency Analysis", type: "bar" },
    { value: "distribution", label: "Distribution Analysis", type: "pie" },
  ],
  email: [
    { value: "domain", label: "Email Domain Distribution", type: "pie" },
    { value: "engagement", label: "Email Provider Analysis", type: "bar" },
  ],
  radio: [
    { value: "distribution", label: "Option Distribution", type: "pie" },
    { value: "trend", label: "Selection Trends", type: "bar" },
  ],
  url: [
    { value: "presence", label: "Website Presence Analysis", type: "pie" },
    { value: "domain", label: "Domain Type Distribution", type: "bar" },
  ],
  number: [
    { value: "range", label: "Value Range Distribution", type: "bar" },
    { value: "average", label: "Average Analysis", type: "line" },
    { value: "comparison", label: "Value Comparison", type: "scatter" },
  ],
  textarea: [
    { value: "length", label: "Content Length Analysis", type: "bar" },
    { value: "sentiment", label: "Content Analysis", type: "pie" },
  ],
  select: [
    { value: "distribution", label: "Option Distribution", type: "pie" },
    { value: "comparison", label: "Selection Comparison", type: "bar" },
  ],
  time: [
    { value: "hourly", label: "Hourly Distribution", type: "bar" },
    { value: "period", label: "Time Period Analysis", type: "line" },
  ],
  date: [
    { value: "monthly", label: "Monthly Distribution", type: "bar" },
    { value: "age", label: "Age Distribution", type: "pie" },
    { value: "yearly", label: "Yearly Trends", type: "line" },
  ],
  checkbox: [
    { value: "boolean", label: "Yes/No Distribution", type: "pie" },
    { value: "correlation", label: "Selection Correlation", type: "bar" },
  ],
  phone: [
    { value: "area", label: "Area Code Distribution", type: "pie" },
    { value: "country", label: "Country Code Analysis", type: "bar" },
  ],
};

const CORRELATION_TYPES = [
  { value: "comparison", label: "Direct Comparison", type: "scatter" },
  { value: "trend", label: "Trend Analysis", type: "line" },
  { value: "distribution", label: "Combined Distribution", type: "bar" },
];

export const DashboardSettings = ({ onAddGraph }: { 
  onAddGraph: (config: GraphConfig) => void 
}) => {
  const { fields: formFields } = useFormFields();
  const [selectedField, setSelectedField] = useState("");
  const [secondaryField, setSecondaryField] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const [isCorrelationMode, setIsCorrelationMode] = useState(false);

  const getFieldType = (fieldId: string) => {
    const field = formFields?.find(f => f.field_id === fieldId);
    return field?.type || "text";
  };

  const getAvailableAnalytics = () => {
    if (!selectedField) return [];
    
    if (isCorrelationMode && secondaryField) {
      return CORRELATION_TYPES;
    }

    const fieldType = getFieldType(selectedField);
    return ANALYSIS_TYPES[fieldType as keyof typeof ANALYSIS_TYPES] || ANALYSIS_TYPES.text;
  };

  const handleAddGraph = () => {
    if (!selectedField) {
      toast.error("Please select a field first");
      return;
    }

    if (isCorrelationMode && !secondaryField) {
      toast.error("Please select a secondary field for correlation");
      return;
    }

    if (!selectedAnalysis) {
      toast.error("Please select an analysis type");
      return;
    }

    const field = formFields?.find(f => f.field_id === selectedField);
    if (!field) return;

    const analytics = getAvailableAnalytics();
    const selectedAnalytic = analytics.find(a => a.value === selectedAnalysis);
    if (!selectedAnalytic) return;

    const title = isCorrelationMode 
      ? `${field.label} vs ${formFields?.find(f => f.field_id === secondaryField)?.label}`
      : `${field.label} ${selectedAnalytic.label}`;

    onAddGraph({
      field: selectedField,
      secondaryField: isCorrelationMode ? secondaryField : undefined,
      type: selectedAnalytic.type,
      title,
      analysisType: selectedAnalysis
    });

    toast.success("Graph added successfully!");
    setSelectedField("");
    setSecondaryField("");
    setSelectedAnalysis("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Settings className="h-4 w-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Graph</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Mode</label>
              <Select 
                value={isCorrelationMode ? "correlation" : "single"} 
                onValueChange={(value) => setIsCorrelationMode(value === "correlation")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose analysis mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Field Analysis</SelectItem>
                  <SelectItem value="correlation">Field Correlation Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Field</label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a field to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {formFields?.map((field) => (
                    <SelectItem key={field.field_id} value={field.field_id}>
                      {field.label} ({field.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isCorrelationMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Secondary Field</label>
                <Select value={secondaryField} onValueChange={setSecondaryField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a field to correlate" />
                  </SelectTrigger>
                  <SelectContent>
                    {formFields?.filter(f => f.field_id !== selectedField).map((field) => (
                      <SelectItem key={field.field_id} value={field.field_id}>
                        {field.label} ({field.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedField && (
              <>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Analysis Type</label>
                  <Select value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableAnalytics().map((analysis) => (
                        <SelectItem key={analysis.value} value={analysis.value}>
                          {analysis.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button onClick={handleAddGraph} className="w-full">
              Add Graph
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};