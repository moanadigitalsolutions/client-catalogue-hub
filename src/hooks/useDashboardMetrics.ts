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

      // Calculate monthly growth trends
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(new Date(), i);
        const monthStart = startOfMonth(date);
        const monthEnd = startOfMonth(subMonths(date, -1));
        
        const monthClients = totalClients.filter(client => {
          const clientDate = parseISO(client.created_at);
          return clientDate >= monthStart && clientDate < monthEnd;
        });

        return {
          month: format(date, 'MMM yyyy'),
          clients: monthClients.length
        };
      }).reverse();

      // Calculate engagement metrics
      const websitePresence = totalClients.filter(client => client.website).length;
      const websitePresenceRate = (websitePresence / totalClients.length) * 100;

      // Calculate completeness of client profiles
      const profileCompleteness = totalClients.map(client => {
        const fields = Object.entries(client).filter(([key]) => 
          !['id', 'created_at'].includes(key)
        );
        const filledFields = fields.filter(([_, value]) => 
          value !== null && value !== ''
        );
        return (filledFields.length / fields.length) * 100;
      });

      const averageProfileCompleteness = profileCompleteness.reduce((a, b) => a + b, 0) / profileCompleteness.length;

      return {
        totalClients,
        totalClientsCount: totalClients.length,
        newClientsThisMonth: newClients.length,
        monthlyGrowthRate: growthRate,
        activeClients: totalClients.length,
        cityData,
        genderData,
        qualificationData,
        ageGroups,
        monthlyData,
        websitePresenceRate,
        averageProfileCompleteness,
        profileCompleteness
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