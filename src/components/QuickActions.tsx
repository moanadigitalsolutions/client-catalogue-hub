import { Plus, FileText, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you might want to do</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button
          variant="outline"
          className="h-24 flex-col"
          onClick={() => navigate("/clients/new")}
        >
          <Plus className="h-6 w-6 mb-2" />
          Add New Client
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col"
          onClick={() => navigate("/reports")}
        >
          <FileText className="h-6 w-6 mb-2" />
          Generate Report
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col"
          onClick={() => navigate("/clients")}
        >
          <Search className="h-6 w-6 mb-2" />
          Search Clients
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col"
          onClick={() => navigate("/settings")}
        >
          <Download className="h-6 w-6 mb-2" />
          Export Data
        </Button>
      </CardContent>
    </Card>
  );
};