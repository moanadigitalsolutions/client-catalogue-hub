import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";
import { DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fromDate = new Date(e.target.value);
    setDate({
      from: fromDate,
      to: date?.to,
    });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const toDate = new Date(e.target.value);
    setDate({
      from: date?.from,
      to: toDate,
    });
  };

  return (
    <div className={cn("grid gap-4", className)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="from-date">From</Label>
        <Input
          type="date"
          id="from-date"
          value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
          onChange={handleFromDateChange}
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="to-date">To</Label>
        <Input
          type="date"
          id="to-date"
          value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
          onChange={handleToDateChange}
          className="w-full"
        />
      </div>
    </div>
  );
}