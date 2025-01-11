import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { startOfMonth, subMonths, format, parseISO, differenceInYears } from "date-fns";

interface DashboardMetric {
  name: string;
  value: number;
}

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
      const processFieldData = (fieldId: string): DashboardMetric[] => {
        if (!Array.isArray(totalClients)) return [];
        const fieldData = totalClients.reduce((acc: { [key: string]: number }, client: any) => {
          if (client[fieldId]) {
            const value = client[fieldId];
            acc[value] = (acc[value] || 0) + 1;
          }
          return acc;
        }, {});

        return Object.entries(fieldData).map(([name, value]): DashboardMetric => ({
          name,
          value: Number(value)
        }));
      };

      // Process correlation data
      const processCorrelationData = (field1: string, field2: string): DashboardMetric[] => {
        if (!Array.isArray(totalClients)) return [];
        return totalClients.reduce((acc: DashboardMetric[], client: any) => {
          if (client[field1] && client[field2]) {
            acc.push({
              name: client[field1],
              value: Number(client[field2]) || 0
            });
          }
          return acc;
        }, []);
      };

      // Process time-based data
      const processTimeData = (fieldId: string): DashboardMetric[] => {
        if (!Array.isArray(totalClients)) return [];
        const timeData = totalClients.reduce((acc: { [key: string]: number }, client: any) => {
          if (client[fieldId]) {
            try {
              const date = parseISO(client[fieldId]);
              // Format date in British/NZ format (DD/MM/YYYY)
              const key = format(date, 'dd/MM/yyyy');
              acc[key] = (acc[key] || 0) + 1;
            } catch (error) {
              console.error('Error processing date:', error);
            }
          }
          return acc;
        }, {});

        return Object.entries(timeData).map(([name, value]): DashboardMetric => ({
          name,
          value: Number(value)
        }));
      };

      // Process numeric data ranges
      const processNumericRanges = (fieldId: string): DashboardMetric[] => {
        if (!Array.isArray(totalClients)) return [];
        
        const values = totalClients
          .map((client: any) => {
            if (!client || !client[fieldId]) return null;
            
            if (fieldId === 'dob' && client[fieldId]) {
              try {
                // Parse the date and calculate age
                const birthDate = parseISO(client[fieldId]);
                const age = differenceInYears(new Date(), birthDate);
                return age;
              } catch (error) {
                console.error('Error calculating age:', error);
                return null;
              }
            }
            
            const value = parseFloat(client[fieldId]);
            return !isNaN(value) ? value : null;
          })
          .filter((value): value is number => value !== null);

        if (values.length === 0) return [];

        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        const bucketSize = range / 5;

        const buckets: DashboardMetric[] = Array.from({ length: 5 }, (_, i) => ({
          name: `${Math.round(min + (i * bucketSize))} - ${Math.round(min + ((i + 1) * bucketSize))}`,
          value: 0
        }));

        values.forEach(value => {
          if (typeof value === 'number' && !isNaN(value)) {
            const bucketIndex = Math.min(Math.floor((value - min) / bucketSize), 4);
            if (bucketIndex >= 0 && bucketIndex < buckets.length) {
              buckets[bucketIndex].value++;
            }
          }
        });

        return buckets.filter(bucket => bucket.value > 0);
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