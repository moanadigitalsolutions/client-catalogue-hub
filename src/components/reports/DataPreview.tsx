import { Card, CardContent } from "@/components/ui/card";
import { TableContent } from "./table/TableContent";
import { ReportData } from "@/utils/reportGenerator";

interface DataPreviewProps {
  data: ReportData[];
  displayFields: string[];
  isLoading?: boolean;
}

export const DataPreview = ({ data, displayFields, isLoading }: DataPreviewProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <TableContent 
          data={data}
          columns={displayFields}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};