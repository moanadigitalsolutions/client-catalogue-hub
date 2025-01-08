import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import { useState } from "react";

// Temporary mock data - replace with actual API calls
const mockMonthlyData = [
  { month: 'Jan', clients: 4 },
  { month: 'Feb', clients: 7 },
  { month: 'Mar', clients: 12 },
  { month: 'Apr', clients: 15 },
  { month: 'May', clients: 18 },
];

const mockCityData = [
  { name: 'Sydney', value: 35 },
  { name: 'Melbourne', value: 25 },
  { name: 'Brisbane', value: 20 },
  { name: 'Perth', value: 15 },
  { name: 'Adelaide', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [showAddWidget, setShowAddWidget] = useState(false);

  // Replace with actual API call
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      console.log('Fetching dashboard metrics...');
      // Simulate API call
      return {
        totalClients: 150,
        newClientsThisMonth: 18,
        activeClients: 120,
      };
    },
  });

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => setShowAddWidget(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardMetricCard
          title="Total Clients"
          value={clientsData?.totalClients || 0}
          description="All time clients"
        />
        <DashboardMetricCard
          title="New Clients"
          value={clientsData?.newClientsThisMonth || 0}
          description="Added this month"
        />
        <DashboardMetricCard
          title="Active Clients"
          value={clientsData?.activeClients || 0}
          description="Currently active"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Client Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="clients" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Client Distribution by City */}
        <Card>
          <CardHeader>
            <CardTitle>Clients by City</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <PieChart>
                <Pie
                  data={mockCityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockCityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;