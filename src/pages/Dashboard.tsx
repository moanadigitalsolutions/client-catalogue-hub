import { QuickActions } from "@/components/QuickActions";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import ClientsByCityChart from "@/components/dashboard/ClientsByCityChart";
import MonthlyGrowthChart from "@/components/dashboard/MonthlyGrowthChart";
import DemographicsChart from "@/components/dashboard/DemographicsChart";
import UserActivities from "@/components/dashboard/UserActivities";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { DashboardSettings } from "@/components/dashboard/DashboardSettings";
import { useState } from "react";

interface CustomGraph {
  field: string;
  type: "pie" | "bar";
  title: string;
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

  const handleAddGraph = (config: CustomGraph) => {
    setCustomGraphs(prev => [...prev, config]);
  };

  // Process data for custom graphs
  const getGraphData = (fieldId: string) => {
    return metrics.totalClients.reduce((acc: any[], client: any) => {
      if (client[fieldId]) {
        const existingItem = acc.find(item => item.name === client[fieldId]);
        if (existingItem) {
          existingItem.value++;
        } else {
          acc.push({ name: client[fieldId], value: 1 });
        }
      }
      return acc;
    }, []);
  };

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
          value={metrics.totalClients}
          description="Total number of clients in the system" 
        />
        <DashboardMetricCard 
          title="New Clients" 
          value={metrics.newClientsThisMonth}
          description="New clients this month" 
        />
        <DashboardMetricCard 
          title="Active Clients" 
          value={metrics.activeClients}
          description="Currently active clients" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ClientsByCityChart data={metrics.cityData} />
        <MonthlyGrowthChart data={metrics.monthlyData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DemographicsChart 
          data={metrics.genderData} 
          title="Gender Distribution"
          colors={['#0088FE', '#FF8042']}
        />
        <DemographicsChart 
          data={metrics.qualificationData} 
          title="Qualification Distribution"
        />
        <DemographicsChart 
          data={metrics.ageGroups} 
          title="Age Distribution"
        />
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