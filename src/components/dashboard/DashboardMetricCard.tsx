import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardMetricCardProps {
  title: string;
  value: number;
  description?: string;
}

const DashboardMetricCard = ({ title, value, description }: DashboardMetricCardProps) => {
  // Format the value safely, handling undefined/null cases
  const formattedValue = value !== undefined && value !== null 
    ? value.toLocaleString()
    : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;