"use client";

import { TRIMESTER_RANGES } from "./fetal-data";

interface TrimesterTabsProps {
  activeTrimester: 1 | 2 | 3;
  onSelect: (trimester: 1 | 2 | 3) => void;
}

export default function TrimesterTabs({
  activeTrimester,
  onSelect,
}: TrimesterTabsProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/60 backdrop-blur-md p-1.5 shadow-sm border border-white/40">
      {TRIMESTER_RANGES.map((t, idx) => {
        const trimester = (idx + 1) as 1 | 2 | 3;
        const isActive = activeTrimester === trimester;
        return (
          <button
            key={trimester}
            onClick={() => onSelect(trimester)}
            className={`
              relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap
              ${
                isActive
                  ? "text-white shadow-lg scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }
            `}
            style={
              isActive
                ? {
                    background: `linear-gradient(135deg, ${t.color}cc, ${t.color})`,
                    boxShadow: `0 4px 15px ${t.color}40`,
                  }
                : {}
            }
            id={`trimester-tab-${trimester}`}
          >
            <span className="relative z-10">{t.label}</span>
            <span className="ml-1.5 text-xs opacity-75">
              (Wk {t.range[0]}–{t.range[1]})
            </span>
          </button>
        );
      })}
    </div>
  );
}
