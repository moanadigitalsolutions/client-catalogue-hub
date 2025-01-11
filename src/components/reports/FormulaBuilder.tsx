import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/types";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface FormulaBuilderProps {
  fields: FormField[];
  onAddFormula: (formula: ReportFormula) => void;
}

export interface ReportFormula {
  name: string;
  expression: string;
  fields: string[];
  operation: "sum" | "average" | "count" | "multiply" | "divide" | "subtract";
}

export const FormulaBuilder = ({ fields, onAddFormula }: FormulaBuilderProps) => {
  const [formulaName, setFormulaName] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [operation, setOperation] = useState<ReportFormula["operation"]>("sum");

  const handleAddFormula = () => {
    if (!formulaName || selectedFields.length === 0) return;

    const formula: ReportFormula = {
      name: formulaName,
      fields: selectedFields,
      operation,
      expression: `${operation}(${selectedFields.join(", ")})`
    };

    onAddFormula(formula);
    setFormulaName("");
    setSelectedFields([]);
    setOperation("sum");
  };

  // Improved numeric field detection
  const numericFields = fields.filter(field => 
    field.type === "number" || 
    ["amount", "quantity", "price", "total", "cost", "value", "number"].some(term => 
      field.field_id.toLowerCase().includes(term) || 
      field.label.toLowerCase().includes(term)
    )
  );

  if (numericFields.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No numeric fields available. Add numeric fields in the form configuration to create formulas.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-md bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Formula Builder</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFormulaName("");
            setSelectedFields([]);
            setOperation("sum");
          }}
        >
          Clear
        </Button>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Formula Name</label>
        <Input
          value={formulaName}
          onChange={(e) => setFormulaName(e.target.value)}
          placeholder="e.g., Total Revenue"
          className="max-w-md"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Operation</label>
        <Select value={operation} onValueChange={(value: ReportFormula["operation"]) => setOperation(value)}>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sum">Sum</SelectItem>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="count">Count</SelectItem>
            <SelectItem value="multiply">Multiply</SelectItem>
            <SelectItem value="divide">Divide</SelectItem>
            <SelectItem value="subtract">Subtract</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Fields</label>
        <Select
          value={selectedFields[0]}
          onValueChange={(value) => setSelectedFields([value])}
        >
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select first field" />
          </SelectTrigger>
          <SelectContent>
            {numericFields.map((field) => (
              <SelectItem key={field.field_id} value={field.field_id}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(operation === "multiply" || operation === "divide" || operation === "subtract") && (
          <Select
            value={selectedFields[1]}
            onValueChange={(value) => 
              setSelectedFields(prev => [prev[0], value])
            }
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select second field" />
            </SelectTrigger>
            <SelectContent>
              {numericFields.map((field) => (
                <SelectItem key={field.field_id} value={field.field_id}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Button 
        onClick={handleAddFormula}
        disabled={!formulaName || selectedFields.length === 0}
        className="w-full md:w-auto"
      >
        Add Formula
      </Button>
    </div>
  );
};