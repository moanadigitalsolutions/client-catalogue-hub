import { QuickActions } from "@/components/QuickActions";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import ClientsByCityChart from "@/components/dashboard/ClientsByCityChart";
import MonthlyGrowthChart from "@/components/dashboard/MonthlyGrowthChart";
import DemographicsChart from "@/components/dashboard/DemographicsChart";
import UserActivities from "@/components/dashboard/UserActivities";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { DashboardSettings } from "@/components/dashboard/DashboardSettings";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CustomGraph {
  field: string;
  secondaryField?: string;
  type: string;
  title: string;
  analysisType: string;
}

const Dashboard = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();
  const [customGraphs, setCustomGraphs] = useState<CustomGraph[]>([]);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!metrics) {
    return <div>Error loading dashboard data</div>;
  }

  // Process data for custom graphs
  const getGraphData = (fieldId: string) => {
    return metrics.processFieldData(fieldId);
  };

  const handleAddGraph = (config: CustomGraph) => {
    setCustomGraphs(prev => [...prev, config]);
  };

  // Calculate website presence rate
  const websitePresenceRate = metrics.totalClients.reduce((count, client) => {
    return count + (client.website ? 1 : 0);
  }, 0) / metrics.totalClientsCount * 100;

  // Calculate profile completeness
  const calculateProfileCompleteness = () => {
    const totalFields = Object.keys(metrics.totalClients[0] || {}).length;
    const completeness = metrics.totalClients.reduce((sum, client) => {
      const filledFields = Object.values(client).filter(value => value !== null && value !== undefined && value !== '').length;
      return sum + (filledFields / totalFields * 100);
    }, 0);
    return completeness / metrics.totalClientsCount;
  };

  const averageProfileCompleteness = calculateProfileCompleteness();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <DashboardSettings onAddGraph={handleAddGraph} />
      </div>

      <QuickActions />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard 
          title="Total Clients" 
          value={metrics.totalClientsCount}
          description="Total number of clients in the system" 
        />
        <DashboardMetricCard 
          title="New Clients" 
          value={metrics.newClientsThisMonth}
          description="New clients this month" 
        />
        <DashboardMetricCard 
          title="Growth Rate" 
          value={metrics.monthlyGrowthRate}
          description="Month-over-month growth rate (%)" 
        />
        <DashboardMetricCard 
          title="Website Presence" 
          value={websitePresenceRate}
          description="Clients with website (%)" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Profile Completeness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average completeness</span>
                <span className="text-sm font-medium">
                  {averageProfileCompleteness.toFixed(1)}%
                </span>
              </div>
              <Progress value={averageProfileCompleteness} />
            </div>
          </CardContent>
        </Card>
        <MonthlyGrowthChart data={metrics.processTimeData('created_at')} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DemographicsChart 
          data={metrics.processFieldData('gender')} 
          title="Gender Distribution"
          colors={['#0088FE', '#FF8042']}
        />
        <DemographicsChart 
          data={metrics.processFieldData('qualification')} 
          title="Qualification Distribution"
        />
        <DemographicsChart 
          data={metrics.processNumericRanges('dob')} 
          title="Age Distribution"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ClientsByCityChart data={metrics.processFieldData('city')} />
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">Client Growth</p>
                  <p className="text-sm text-muted-foreground">
                    {metrics.monthlyGrowthRate > 0 
                      ? `Growing at ${metrics.monthlyGrowthRate.toFixed(1)}% monthly`
                      : 'No growth this month'}
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">Profile Quality</p>
                  <p className="text-sm text-muted-foreground">
                    {`${averageProfileCompleteness.toFixed(1)}% average profile completeness`}
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">Online Presence</p>
                  <p className="text-sm text-muted-foreground">
                    {`${websitePresenceRate.toFixed(1)}% of clients have websites`}
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {customGraphs.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customGraphs.map((graph, index) => (
            <DemographicsChart
              key={`${graph.field}-${index}`}
              data={getGraphData(graph.field)}
              title={graph.title}
            />
          ))}
        </div>
      )}

      <UserActivities />
    </div>
  );
};

export default Dashboard;