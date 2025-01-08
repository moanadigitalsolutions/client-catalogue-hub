import { QuickActions } from "@/components/QuickActions";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { ClientsByCityChart } from "@/components/dashboard/ClientsByCityChart";
import { MonthlyGrowthChart } from "@/components/dashboard/MonthlyGrowthChart";
import { UserActivities } from "@/components/dashboard/UserActivities";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <QuickActions />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ClientsByCityChart />
        <MonthlyGrowthChart />
      </div>
      <UserActivities />
    </div>
  );
};

export default Dashboard;