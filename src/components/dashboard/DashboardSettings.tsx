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

interface GraphConfig {
  field: string;
  type: "pie" | "bar";
  title: string;
}

export const DashboardSettings = ({ onAddGraph }: { 
  onAddGraph: (config: GraphConfig) => void 
}) => {
  const { fields: formFields } = useFormFields();
  const [selectedField, setSelectedField] = useState("");
  const [graphType, setGraphType] = useState<"pie" | "bar">("pie");

  const handleAddGraph = () => {
    if (!selectedField) {
      toast.error("Please select a field first");
      return;
    }

    const field = formFields?.find(f => f.field_id === selectedField);
    if (!field) return;

    onAddGraph({
      field: selectedField,
      type: graphType,
      title: `${field.label} Distribution`
    });

    toast.success("Graph added successfully!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Settings className="h-4 w-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Graph</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Field</label>
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a field to visualize" />
              </SelectTrigger>
              <SelectContent>
                {formFields?.map((field) => (
                  <SelectItem key={field.field_id} value={field.field_id}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Graph Type</label>
            <Select value={graphType} onValueChange={(value: "pie" | "bar") => setGraphType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose graph type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAddGraph} className="w-full">
            Add Graph
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};