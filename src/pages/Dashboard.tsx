import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import MonthlyGrowthChart from "@/components/dashboard/MonthlyGrowthChart";
import ClientsByCityChart from "@/components/dashboard/ClientsByCityChart";
import UserBadge from "@/components/dashboard/UserBadge";
import UserActivities from "@/components/dashboard/UserActivities";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [showAddWidget, setShowAddWidget] = useState(false);
  const { data: clientsData, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <UserBadge />
        </div>
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <MonthlyGrowthChart 
            data={clientsData?.monthlyData || []} 
            className="h-[360px]"
          />
          <UserActivities />
        </div>
        <div className="space-y-6">
          <ClientsByCityChart 
            data={clientsData?.cityData || []} 
            className="h-[360px]"
          />
          {clientsData?.genderData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{clientsData.genderData.male || 0}</div>
                    <div className="text-sm text-muted-foreground mt-1">Male</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{clientsData.genderData.female || 0}</div>
                    <div className="text-sm text-muted-foreground mt-1">Female</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;