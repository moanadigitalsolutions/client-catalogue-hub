import { supabase } from '@/lib/supabase';
import { DateRange } from '@/types';

interface ReportFilters {
  city?: string;
  status?: string;
  dateRange?: DateRange;
}

interface ClientData {
  id: string;
  created_at: string;
  [key: string]: string | number | boolean | Date;
}

const fetchReportData = async (filters: ReportFilters = {}) => {
  try {
    let query = supabase.from('clients').select('*');

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      query = query.gte('created_at', filters.dateRange.from.toISOString())
                  .lte('created_at', filters.dateRange.to.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching report data:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data as ClientData[];
  } catch (error) {
    console.error('Error in fetchReportData:', error);
    return [];
  }
};

export { fetchReportData };
export type { ReportFilters, ClientData };