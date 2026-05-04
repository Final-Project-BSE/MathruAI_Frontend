"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatAppointmentDate, isDateUnavailable, isPastDate } from "./utils";

type UnavailableDateCalendarProps = {
  value?: Date;
  onChange: (date?: Date) => void;
  unavailableDates: string[];
  reasonByDate?: Record<string, string>;
};

export default function UnavailableDateCalendar({
  value,
  onChange,
  unavailableDates,
  reasonByDate = {},
}: UnavailableDateCalendarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const unavailableDateSet = useMemo(
    () =>
      new Set(
        unavailableDates.map((raw) => {
          const parsed = new Date(raw);
          if (Number.isNaN(parsed.getTime())) return raw;
          return format(parsed, "yyyy-MM-dd");
        })
      ),
    [unavailableDates]
  );

  const disabledDate = (date: Date) => {
    return isPastDate(date) || isDateUnavailable(date, unavailableDateSet);
  };

  const unavailableDateObjects = unavailableDates
    .map((value) => {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    })
    .filter((item): item is Date => Boolean(item));

  function handleDateSelect(nextDate?: Date) {
    if (!nextDate) return;
    if (disabledDate(nextDate)) return;

    onChange(nextDate);
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wide text-zinc-900">
        Available Date
      </label>

      <div className="relative" ref={containerRef}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen((previous) => !previous)}
            className={cn(
              "w-full justify-start border-[#d04f51]/20 bg-[#d04f51]/10 text-left text-sm text-zinc-900 hover:bg-[#d04f51]/12",
              !value && "text-zinc-500"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {value ? formatAppointmentDate(value) : "Select a date"}
          </Button>

        {open ? (
          <div className="absolute left-0 top-full z-50 mt-2 w-auto rounded-md border border-[#d04f51]/20 bg-[#d04f51]/10 p-2 shadow-lg backdrop-blur-sm text-zinc-800">
            <Calendar
              mode="single"
              selected={value}
              defaultMonth={value || new Date()}
              onSelect={handleDateSelect}
              disabled={disabledDate}
              modifiers={{ unavailable: unavailableDateObjects }}
              modifiersClassNames={{ unavailable: "line-through text-red-700/80 opacity-70" }}
              classNames={{
                caption_label: "text-sm font-semibold text-zinc-900",
                nav_button:
                  "h-7 w-7 rounded-full border border-[#d04f51]/20 bg-[#d04f51]/10 p-0 text-zinc-800 hover:bg-[#d04f51]/20",
                head_cell: "w-8 text-zinc-700",
                day: "h-8 w-8 rounded-full text-zinc-800 hover:bg-[#d04f51]/20",
                day_today: "bg-[#d04f51]/20 text-zinc-900",
                day_selected:
                  "bg-[#d04f51] text-white hover:bg-[#b94245] focus:bg-[#b94245]",
                day_disabled: "text-zinc-600 opacity-60",
                day_outside: "text-zinc-700 opacity-50",
              }}
              className="rounded-md"
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800">
        <div className="flex items-center gap-1.5 font-medium text-amber-900">
          <TriangleAlert className="h-3.5 w-3.5" />
          Unavailable dates cannot be booked.
        </div>

        {unavailableDates.length ? (
          <p className="mt-1 text-amber-700">
            Blocked dates: {unavailableDates.slice(0, 4).join(", ")}
            {unavailableDates.length > 4 ? " ..." : ""}
          </p>
        ) : (
          <p className="mt-1 text-amber-700">No blocked dates found.</p>
        )}

        {value ? (
          <p className="mt-1 text-amber-700">
            {(() => {
              const key = format(value, "yyyy-MM-dd");
              return reasonByDate[key] ? `Selected day note: ${reasonByDate[key]}` : "";
            })()}
          </p>
        ) : null}
      </div>
    </div>
  );
}
