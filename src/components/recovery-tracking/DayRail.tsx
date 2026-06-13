import React from "react";

interface DayRailProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  dayLabel?: string;
}

export default function DayRail({
  selectedDay,
  onSelectDay,
  dayLabel = "Day",
}: DayRailProps) {
  const days = Array.from({ length: 42 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden py-3">
      <div
        className="
          grid w-full min-w-0 gap-2 px-4 pb-2
          grid-cols-4
          min-[420px]:grid-cols-5
          sm:grid-cols-6
          md:grid-cols-7
          lg:grid-cols-8
          xl:grid-cols-10
          2xl:grid-cols-12
        "
      >
        {days.map((day) => {
          const isSelected = day === selectedDay;

          return (
            <button
              key={day}
              type="button"
              data-day={day}
              onClick={() => onSelectDay(day)}
              className={`
                flex h-16 min-w-0 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300
                ${
                  isSelected
                    ? "scale-[1.04] border-[#d04f51] bg-[#d04f51] text-white shadow-md"
                    : "border-white bg-white/60 text-gray-600 hover:scale-[1.03] hover:bg-white"
                }
              `}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isSelected ? "text-pink-100" : "text-gray-400"
                }`}
              >
                {dayLabel}
              </span>

              <span className="text-xl font-extrabold leading-tight">
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}