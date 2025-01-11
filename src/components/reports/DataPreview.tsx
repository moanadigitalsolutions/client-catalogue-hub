import { Card, CardContent } from "@/components/ui/card";
import { TableContent } from "./table/TableContent";
import { ReportData } from "@/utils/reportGenerator";

interface DataPreviewProps {
  data: ReportData[];
  displayFields: string[];
  isLoading: boolean;
}

export const DataPreview = ({ data, displayFields, isLoading }: DataPreviewProps) => {
  console.log('DataPreview received:', { data, displayFields, isLoading });
  
  return (
    <Card>
      <CardContent className="p-0">
        <TableContent 
          data={data} 
          columns={displayFields}
          isLoading={isLoading} 
        />
      </CardContent>
    </Card>
  );
};