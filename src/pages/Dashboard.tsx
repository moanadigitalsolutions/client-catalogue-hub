import { QuickActions } from "@/components/QuickActions";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import ClientsByCityChart from "@/components/dashboard/ClientsByCityChart";
import MonthlyGrowthChart from "@/components/dashboard/MonthlyGrowthChart";
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-6 md:grid-cols-2">
        <ClientsByCityChart data={metrics.cityData} className="shadow-md hover:shadow-lg transition-shadow duration-200" />
        <MonthlyGrowthChart data={metrics.monthlyData} className="shadow-md hover:shadow-lg transition-shadow duration-200" />
      </div>
      <UserActivities />
    </div>
  );
};

export default Dashboard;