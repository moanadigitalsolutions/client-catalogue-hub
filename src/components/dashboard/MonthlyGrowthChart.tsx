import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MonthlyGrowthChartProps {
  data: Array<{ name: string; value: number }>;
  className?: string;
}

const MonthlyGrowthChart = ({ data, className }: MonthlyGrowthChartProps) => {
  // Transform data to match the required format
  const transformedData = data.map(item => ({
    month: item.name,
    clients: item.value
  }));

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Monthly Growth</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={transformedData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="clients" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#8884d8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyGrowthChart;