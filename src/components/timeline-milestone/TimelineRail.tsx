"use client";

import { useRef, useEffect } from "react";
import { FETAL_DATA, TRIMESTER_RANGES } from "./fetal-data";

interface TimelineRailProps {
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
}

export default function TimelineRail({
  selectedWeek,
  onSelectWeek,
}: TimelineRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const pill = pillRefs.current.get(selectedWeek);
    if (pill && railRef.current) {
      pill.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedWeek]);

  const getTrimesterColor = (trimester: 1 | 2 | 3) => {
    return TRIMESTER_RANGES[trimester - 1].color;
  };

  return (
    <div className="relative">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#fed2cc] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fed2cc] to-transparent z-10" />

      <div
        ref={railRef}
        className="flex flex-nowrap items-center gap-2 overflow-x-auto py-3 px-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {FETAL_DATA.map((weekData) => {
          const isSelected = weekData.week === selectedWeek;
          const color = getTrimesterColor(weekData.trimester);

          return (
            <button
              key={weekData.week}
              ref={(el) => {
                if (el) pillRefs.current.set(weekData.week, el);
              }}
              onClick={() => onSelectWeek(weekData.week)}
              className={`
                relative shrink-0 flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 transition-all duration-300
                ${
                  isSelected
                    ? "text-white shadow-lg scale-110"
                    : "bg-white/60 text-gray-600 hover:bg-white hover:shadow-md hover:scale-105 border border-white/50"
                }
              `}
              style={
                isSelected
                  ? {
                      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                      boxShadow: `0 4px 20px ${color}50`,
                    }
                  : {}
              }
              title={weekData.title}
              id={`week-pill-${weekData.week}`}
            >
              {/* Pulse ring for active */}
              {isSelected && (
                <span
                  className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                  style={{ background: color }}
                />
              )}
              <span className="relative text-xs font-bold">
                W{weekData.week}
              </span>
              <span className="relative text-[10px] opacity-75">
                {weekData.emoji}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
