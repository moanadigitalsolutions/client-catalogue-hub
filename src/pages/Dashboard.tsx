import { QuickActions } from "@/components/QuickActions";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import ClientsByCityChart from "@/components/dashboard/ClientsByCityChart";
import MonthlyGrowthChart from "@/components/dashboard/MonthlyGrowthChart";
import DemographicsChart from "@/components/dashboard/DemographicsChart";
import UserActivities from "@/components/dashboard/UserActivities";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

const Dashboard = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!metrics) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="space-y-6">
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
      <UserActivities />
    </div>
  );
};

export default Dashboard;