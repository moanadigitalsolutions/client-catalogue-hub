import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface MonthlyData {
  month: string;
  clients: number;
}

interface MonthlyGrowthChartProps {
  data: MonthlyData[];
}

const MonthlyGrowthChart = ({ data }: MonthlyGrowthChartProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Monthly Client Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px] w-full" config={{}}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="clients" fill="#8884d8" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyGrowthChart;