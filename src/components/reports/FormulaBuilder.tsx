import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/types";
import { useState } from "react";

interface FormulaBuilderProps {
  fields: FormField[];
  onAddFormula: (formula: ReportFormula) => void;
}

export interface ReportFormula {
  name: string;
  expression: string;
  fields: string[];
  operation: "sum" | "average" | "count" | "multiply" | "divide" | "subtract" | "conditional";
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

  const numericFields = fields.filter(field => 
    field.type === "number" || 
    ["amount", "quantity", "price"].some(term => 
      field.field_id.toLowerCase().includes(term)
    )
  );

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">Formula Builder</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Formula Name</label>
        <Input
          value={formulaName}
          onChange={(e) => setFormulaName(e.target.value)}
          placeholder="e.g., Total Revenue"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Operation</label>
        <Select value={operation} onValueChange={(value: ReportFormula["operation"]) => setOperation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sum">Sum</SelectItem>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="count">Count</SelectItem>
            <SelectItem value="multiply">Multiply</SelectItem>
            <SelectItem value="divide">Divide</SelectItem>
            <SelectItem value="subtract">Subtract</SelectItem>
            <SelectItem value="conditional">Conditional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Fields</label>
        <Select
          value={selectedFields[0]}
          onValueChange={(value) => setSelectedFields([value])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select field" />
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
            <SelectTrigger>
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
      >
        Add Formula
      </Button>
    </div>
  );
};