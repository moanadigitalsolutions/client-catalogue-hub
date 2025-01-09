import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { startOfMonth, endOfMonth, startOfYear, sub } from "date-fns";

interface ReportFiltersProps {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
}

type PeriodOption = "custom" | "this-month" | "last-month" | "ytd" | "all-time";

export const ReportFilters = ({
  dateRange,
  setDateRange,
}: ReportFiltersProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("this-month");

  useEffect(() => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case "this-month":
        setDateRange({
          from: startOfMonth(now),
          to: endOfMonth(now)
        });
        break;
      case "last-month":
        const lastMonth = sub(now, { months: 1 });
        setDateRange({
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth)
        });
        break;
      case "ytd":
        setDateRange({
          from: startOfYear(now),
          to: now
        });
        break;
      case "all-time":
        setDateRange(undefined);
        break;
      case "custom":
        // Don't modify the date range when switching to custom
        break;
    }
  }, [selectedPeriod, setDateRange]);

  const handleCustomDateChange = (newDateRange: DateRange | undefined) => {
    setSelectedPeriod("custom");
    setDateRange(newDateRange);
  };

  return (
    <div className="mt-6 space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Period</Label>
            <Select value={selectedPeriod} onValueChange={(value: PeriodOption) => setSelectedPeriod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedPeriod === "custom" && (
            <div className="space-y-2">
              <Label>Custom Date Range</Label>
              <DatePickerWithRange 
                date={dateRange} 
                setDate={handleCustomDateChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};