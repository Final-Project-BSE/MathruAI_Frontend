"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { AppointmentTheme } from "./utils";
import { formatAppointmentDate, isDateUnavailable, isPastDate } from "./utils";

type UnavailableDateCalendarProps = {
  value?: Date;
  onChange: (date?: Date) => void;
  unavailableDates: string[];
  reasonByDate?: Record<string, string>;
  theme?: AppointmentTheme;
};

export default function UnavailableDateCalendar({
  value,
  onChange,
  unavailableDates,
  reasonByDate = {},
  theme = "light",
}: UnavailableDateCalendarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDark = theme === "dark";

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
      <label
        className={
          isDark
            ? "text-xs font-medium uppercase tracking-wide text-zinc-200"
            : "text-xs font-medium uppercase tracking-wide text-zinc-900"
        }
      >
        Available Date
      </label>

      <div className="relative" ref={containerRef}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen((previous) => !previous)}
          className={cn(
            isDark
              ? "w-full justify-start border-white/10 bg-white/5 text-left text-sm text-zinc-100 hover:bg-white/10"
              : "w-full justify-start border-[#d04f51]/20 bg-[#d04f51]/10 text-left text-sm text-zinc-900 hover:bg-[#d04f51]/12",
            !value && "text-zinc-500"
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {value ? formatAppointmentDate(value) : "Select a date"}
        </Button>

        {open ? (
          <div
            className={
              isDark
                ? "absolute left-0 top-full z-50 mt-2 w-auto rounded-md border border-white/10 bg-zinc-950 p-2 text-zinc-100 shadow-lg backdrop-blur-sm"
                : "absolute left-0 top-full z-50 mt-2 w-auto rounded-md border border-[#d04f51]/20 bg-[#d04f51]/10 p-2 text-zinc-800 shadow-lg backdrop-blur-sm"
            }
          >
            <Calendar
              mode="single"
              selected={value}
              defaultMonth={value || new Date()}
              onSelect={handleDateSelect}
              disabled={disabledDate}
              modifiers={{ unavailable: unavailableDateObjects }}
              modifiersClassNames={{
                unavailable: isDark
                  ? "line-through text-red-300/80 opacity-70"
                  : "line-through text-red-700/80 opacity-70",
              }}
              classNames={{
                caption_label: isDark
                  ? "text-sm font-semibold text-zinc-100"
                  : "text-sm font-semibold text-zinc-900",
                nav_button: isDark
                  ? "h-7 w-7 rounded-full border border-white/10 bg-white/5 p-0 text-zinc-100 hover:bg-white/10"
                  : "h-7 w-7 rounded-full border border-[#d04f51]/20 bg-[#d04f51]/10 p-0 text-zinc-800 hover:bg-[#d04f51]/20",
                head_cell: isDark ? "w-8 text-zinc-400" : "w-8 text-zinc-700",
                day: isDark
                  ? "h-8 w-8 rounded-full text-zinc-200 hover:bg-white/10"
                  : "h-8 w-8 rounded-full text-zinc-800 hover:bg-[#d04f51]/20",
                day_today: isDark
                  ? "bg-white/10 text-zinc-100"
                  : "bg-[#d04f51]/20 text-zinc-900",
                day_selected:
                  "bg-[#d04f51] text-white hover:bg-[#b94245] focus:bg-[#b94245]",
                day_disabled: "text-zinc-600 opacity-60",
                day_outside: isDark ? "text-zinc-600 opacity-50" : "text-zinc-700 opacity-50",
              }}
              className="rounded-md"
            />
          </div>
        ) : null}
      </div>

      <div
        className={
          isDark
            ? "rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] text-amber-200"
            : "rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800"
        }
      >
        <div
          className={
            isDark
              ? "flex items-center gap-1.5 font-medium text-amber-100"
              : "flex items-center gap-1.5 font-medium text-amber-900"
          }
        >
          <TriangleAlert className="h-3.5 w-3.5" />
          Unavailable dates cannot be booked.
        </div>

        {unavailableDates.length ? (
          <p className={isDark ? "mt-1 text-amber-200" : "mt-1 text-amber-700"}>
            Blocked dates: {unavailableDates.slice(0, 4).join(", ")}
            {unavailableDates.length > 4 ? " ..." : ""}
          </p>
        ) : (
          <p className={isDark ? "mt-1 text-amber-200" : "mt-1 text-amber-700"}>
            No blocked dates found.
          </p>
        )}

        {value ? (
          <p className={isDark ? "mt-1 text-amber-200" : "mt-1 text-amber-700"}>
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
