import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

interface DemographicsChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DemographicsChart = ({ data, title, colors = DEFAULT_COLORS }: DemographicsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[200px]" config={{}}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-sm" 
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemographicsChart;