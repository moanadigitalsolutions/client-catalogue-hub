import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      console.log('Fetching dashboard metrics...');
      
      const { data: totalClients, error: countError } = await supabase
        .from('clients')
        .select('*');
      
      if (countError) {
        console.error('Error fetching total clients:', countError);
        throw countError;
      }

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data: newClients, error: newClientsError } = await supabase
        .from('clients')
        .select('*')
        .gte('created_at', startOfMonth.toISOString());

      if (newClientsError) {
        console.error('Error fetching new clients:', newClientsError);
        throw newClientsError;
      }

      const cityData = totalClients.reduce((acc: any[], client) => {
        if (client.city) {
          const existingCity = acc.find(item => item.name === client.city);
          if (existingCity) {
            existingCity.value++;
          } else {
            acc.push({ name: client.city, value: 1 });
          }
        }
        return acc;
      }, []);

      const monthlyData = Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthClients = totalClients.filter(client => {
          const clientDate = new Date(client.created_at);
          return clientDate >= monthStart && clientDate <= monthEnd;
        });

        return {
          month: date.toLocaleString('default', { month: 'short' }),
          clients: monthClients.length
        };
      }).reverse();

      return {
        totalClients: totalClients.length,
        newClientsThisMonth: newClients.length,
        activeClients: totalClients.length,
        cityData,
        monthlyData
      };
    },
  });
};