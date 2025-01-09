import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImportSection } from "./ImportSection";
import { ExportSection } from "./ExportSection";

export const DataImportExport = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Import/Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              <li>Excel files (.xlsx, .xls) and JSON files are supported</li>
              <li>Download the Excel template to see the required format</li>
              <li>The ID field will be auto-generated for new records</li>
              <li>Make sure all required fields are filled</li>
              <li>Do not modify the header row in the Excel template</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <ImportSection />
          <ExportSection />
        </div>
      </CardContent>
    </Card>
  );
};