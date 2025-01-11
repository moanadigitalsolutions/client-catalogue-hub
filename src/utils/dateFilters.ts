import { parseISO, isValid, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { ReportData } from "./reportGenerator";

export const filterDataByDateRange = (data: ReportData[], dateRange: DateRange | undefined): ReportData[] => {
  console.log('Filtering data with date range:', dateRange);
  
  if (!dateRange?.from) {
    console.log('No date range provided, returning all data');
    return data;
  }

  return data.filter(row => {
    if (!row.created_at) {
      console.log('Row has no created_at date:', row);
      return false;
    }

    try {
      const dateValue = row.created_at;
      const rowDate = typeof dateValue === 'string' 
        ? parseISO(dateValue)
        : dateValue instanceof Date 
          ? dateValue 
          : new Date(Number(dateValue));
      
      if (!isValid(rowDate)) {
        console.log('Invalid date found:', row.created_at);
        return false;
      }

      const fromDate = startOfDay(dateRange.from);
      const toDate = dateRange.to ? endOfDay(dateRange.to) : undefined;

      const isAfterStart = !isBefore(rowDate, fromDate);
      const isBeforeEnd = toDate ? !isAfter(rowDate, toDate) : true;

      console.log('Row date comparison:', {
        rowDate,
        fromDate,
        toDate,
        isAfterStart,
        isBeforeEnd
      });

      return isAfterStart && isBeforeEnd;
    } catch (error) {
      console.error('Error processing date:', error);
      return false;
    }
  });
};