import React, { useRef, useEffect } from "react";

interface DayRailProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export default function DayRail({ selectedDay, onSelectDay }: DayRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const selectedEl = scrollRef.current.querySelector(
        `[data-day="${selectedDay}"]`
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedDay]);

  const days = Array.from({ length: 42 }, (_, i) => i + 1);

  return (
    <div className="relative w-full overflow-hidden py-3">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 px-4 pb-2 scrollbar-hide snap-x"
        style={{ scrollBehavior: "smooth" }}
      >
        {days.map((day) => {
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              data-day={day}
              onClick={() => onSelectDay(day)}
              className={`snap-center cursor-pointer shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? "bg-[#ec4899] border-[#ec4899] text-white shadow-md transform scale-110"
                  : "bg-white/60 border-white text-gray-600 hover:bg-white hover:scale-105"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-pink-100' : 'text-gray-400'}`}>
                Day
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
