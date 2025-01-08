import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import MonthlyGrowthChart from "@/components/dashboard/MonthlyGrowthChart";
import ClientsByCityChart from "@/components/dashboard/ClientsByCityChart";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useState } from "react";

const Dashboard = () => {
  const [showAddWidget, setShowAddWidget] = useState(false);
  const { data: clientsData, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => setShowAddWidget(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2">
        <MonthlyGrowthChart data={clientsData?.monthlyData || []} />
        <ClientsByCityChart data={clientsData?.cityData || []} />
      </div>
    </div>
  );
};

export default Dashboard;