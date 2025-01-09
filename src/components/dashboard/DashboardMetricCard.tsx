import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardMetricCardProps {
  title: string;
  value: number;
  description?: string;
}

const DashboardMetricCard = ({ title, value, description }: DashboardMetricCardProps) => {
  return (
    <Card className="bg-card shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
          {value.toLocaleString()}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;