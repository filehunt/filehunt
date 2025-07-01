import * as React from "react";
import { Calendar } from "lucide-react";
import { Button } from "./button";
import { Calendar as CalendarComponent } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DatePickerWithRangeProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
}

export function DatePickerWithRange({ value, onChange, placeholder = "Pick a date range" }: DatePickerWithRangeProps) {
  const [range, setRange] = React.useState<DateRange>(value || {});

  const handleSelect = (newRange: DateRange) => {
    setRange(newRange);
    onChange?.(newRange);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-[#2a2d3a] border-[#3a3d4a] text-white hover:bg-[#3a3d4a]"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {range.from ? (
            range.to ? (
              <>
                {range.from.toLocaleDateString()} - {range.to.toLocaleDateString()}
              </>
            ) : (
              range.from.toLocaleDateString()
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#2a2d3a] border-[#3a3d4a]" align="start">
        {/* <CalendarComponent
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
          className="text-white"
        > */}
      </PopoverContent>
    </Popover>
  );
}
