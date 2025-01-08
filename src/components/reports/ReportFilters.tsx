import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";

interface ReportFiltersProps {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
  groupBy: string;
  setGroupBy: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const ReportFilters = ({
  dateRange,
  setDateRange,
  groupBy,
  setGroupBy,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  searchTerm,
  setSearchTerm,
}: ReportFiltersProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label>Date Range</Label>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>
      <div className="space-y-2">
        <Label>Group By</Label>
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger>
            <SelectValue placeholder="Select grouping" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="city">City</SelectItem>
            <SelectItem value="qualification">Qualification</SelectItem>
            <SelectItem value="created_at">Creation Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Select sorting field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="created_at">Creation Date</SelectItem>
            <SelectItem value="city">City</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Sort Order</Label>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          placeholder="Search in results..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};