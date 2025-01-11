import { FormField } from "@/types";
import { Separator } from "@/components/ui/separator";
import { FormulaBuilder, ReportFormula } from "../FormulaBuilder";

interface FormulaSectionProps {
  fields: FormField[];
  onAddFormula: (formula: ReportFormula) => void;
}

export const FormulaSection = ({ fields, onAddFormula }: FormulaSectionProps) => {
  return (
    <>
      <Separator />
      <FormulaBuilder 
        fields={fields}
        onAddFormula={onAddFormula}
      />
    </>
  );
};