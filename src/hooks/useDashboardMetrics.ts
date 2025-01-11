import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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

      // Process city data
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

      // Process gender data
      const genderData = totalClients.reduce((acc: any[], client) => {
        if (client.gender) {
          const existingGender = acc.find(item => item.name === client.gender);
          if (existingGender) {
            existingGender.value++;
          } else {
            acc.push({ name: client.gender, value: 1 });
          }
        }
        return acc;
      }, []);

      // Process qualification data
      const qualificationData = totalClients.reduce((acc: any[], client) => {
        if (client.qualification) {
          const existingQual = acc.find(item => item.name === client.qualification);
          if (existingQual) {
            existingQual.value++;
          } else {
            acc.push({ name: client.qualification, value: 1 });
          }
        }
        return acc;
      }, []);

      // Calculate age groups if DOB exists
      const ageGroups = totalClients.reduce((acc: any[], client) => {
        if (client.dob) {
          const age = new Date().getFullYear() - new Date(client.dob).getFullYear();
          const ageGroup = getAgeGroup(age);
          const existingGroup = acc.find(item => item.name === ageGroup);
          if (existingGroup) {
            existingGroup.value++;
          } else {
            acc.push({ name: ageGroup, value: 1 });
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
        genderData,
        qualificationData,
        ageGroups,
        monthlyData
      };
    },
  });
};

const getAgeGroup = (age: number): string => {
  if (age < 18) return "Under 18";
  if (age < 25) return "18-24";
  if (age < 35) return "25-34";
  if (age < 45) return "35-44";
  if (age < 55) return "45-54";
  return "55+";
};