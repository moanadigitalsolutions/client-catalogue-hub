import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

interface DateRangeFilterProps {
  filterDateRange: DateRange | undefined;
  setFilterDateRange: (range: DateRange | undefined) => void;
  onApplyFilter: () => void;
}

export const DateRangeFilter = ({
  filterDateRange,
  setFilterDateRange,
  onApplyFilter,
}: DateRangeFilterProps) => {
  return (
    <div className="space-y-4">
      <Label>Date Range Filter</Label>
      <div className="flex gap-4 items-end">
        <DatePickerWithRange
          date={filterDateRange}
          setDate={setFilterDateRange}
        />
        <Button onClick={onApplyFilter}>
          Apply Filter
        </Button>
      </div>
    </div>
  );
};