import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { startOfMonth, subMonths, format, parseISO } from "date-fns";

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

      const startOfCurrentMonth = startOfMonth(new Date());
      
      const { data: newClients, error: newClientsError } = await supabase
        .from('clients')
        .select('*')
        .gte('created_at', startOfCurrentMonth.toISOString());

      if (newClientsError) {
        console.error('Error fetching new clients:', newClientsError);
        throw newClientsError;
      }

      // Calculate client growth rate
      const previousMonth = subMonths(startOfCurrentMonth, 1);
      const { data: lastMonthClients } = await supabase
        .from('clients')
        .select('*')
        .gte('created_at', previousMonth.toISOString())
        .lt('created_at', startOfCurrentMonth.toISOString());

      const growthRate = lastMonthClients?.length > 0 
        ? ((newClients.length - lastMonthClients.length) / lastMonthClients.length) * 100 
        : 0;

      // Process data for analytics
      const processFieldData = (fieldId: string) => {
        if (!Array.isArray(totalClients)) return [];
        return totalClients.reduce((acc: any[], client: any) => {
          if (client[fieldId]) {
            const value = client[fieldId];
            const existingItem = acc.find(item => item.name === value);
            if (existingItem) {
              existingItem.value++;
            } else {
              acc.push({ name: value, value: 1 });
            }
          }
          return acc;
        }, []);
      };

      // Process correlation data
      const processCorrelationData = (field1: string, field2: string) => {
        if (!Array.isArray(totalClients)) return [];
        return totalClients.reduce((acc: any[], client: any) => {
          if (client[field1] && client[field2]) {
            acc.push({
              name: client[field1],
              value: client[field2],
              size: 1
            });
          }
          return acc;
        }, []);
      };

      // Process time-based data
      const processTimeData = (fieldId: string) => {
        if (!Array.isArray(totalClients)) return [];
        const timeData = totalClients.reduce((acc: any, client: any) => {
          if (client[fieldId]) {
            const date = new Date(client[fieldId]);
            const key = format(date, 'MMM yyyy');
            acc[key] = (acc[key] || 0) + 1;
          }
          return acc;
        }, {});

        return Object.entries(timeData).map(([name, value]) => ({
          name,
          value
        }));
      };

      // Process numeric data ranges
      const processNumericRanges = (fieldId: string) => {
        if (!Array.isArray(totalClients)) return [];
        
        const values = totalClients
          .map((client: any) => {
            if (fieldId === 'dob' && client[fieldId]) {
              // Calculate age for DOB field
              const birthDate = new Date(client[fieldId]);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              return age;
            }
            return parseFloat(client[fieldId]);
          })
          .filter((value: number) => !isNaN(value));

        if (values.length === 0) return [];

        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        const bucketSize = range / 5;

        const buckets = Array.from({ length: 5 }, (_, i) => ({
          name: `${(min + (i * bucketSize)).toFixed(1)} - ${(min + ((i + 1) * bucketSize)).toFixed(1)}`,
          value: 0
        }));

        values.forEach((value: number) => {
          const bucketIndex = Math.min(Math.floor((value - min) / bucketSize), 4);
          buckets[bucketIndex].value++;
        });

        return buckets;
      };

      return {
        totalClients,
        totalClientsCount: totalClients.length,
        newClientsThisMonth: newClients.length,
        monthlyGrowthRate: growthRate,
        processFieldData,
        processCorrelationData,
        processTimeData,
        processNumericRanges,
      };
    },
  });
};