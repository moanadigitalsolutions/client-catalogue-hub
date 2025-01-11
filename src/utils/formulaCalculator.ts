import { ReportData } from "./reportGenerator";
import { ReportFormula } from "@/components/reports/FormulaBuilder";

export const calculateFormulaResult = (row: ReportData, formula: ReportFormula): number => {
  const values = formula.fields.map(field => Number(row[field]) || 0);
  
  switch (formula.operation) {
    case "sum":
      return values.reduce((acc, val) => acc + val, 0);
    case "average":
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    case "count":
      return values.filter(val => val !== 0).length;
    case "multiply":
      return values.reduce((acc, val) => acc * val, 1);
    case "divide":
      return values[1] !== 0 ? values[0] / values[1] : 0;
    case "subtract":
      return values[0] - (values[1] || 0);
    default:
      return 0;
  }
};