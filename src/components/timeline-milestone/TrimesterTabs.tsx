"use client";

import { useEffect, useState } from "react";
import { TRIMESTER_RANGES } from "./fetal-data";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface TrimesterTabsProps {
  activeTrimester: 1 | 2 | 3;
  onSelect: (trimester: 1 | 2 | 3) => void;
}

export default function TrimesterTabs({
  activeTrimester,
  onSelect,
}: TrimesterTabsProps) {
  const { language } = useLanguage();

  const [labels, setLabels] = useState({
    weekShort: "Wk",
    trimesters: TRIMESTER_RANGES.map((item) => item.label),
  });

  useEffect(() => {
    let active = true;

    async function loadTranslations() {
      const [weekShort, trimesters] = await Promise.all([
        translateText("Wk", language),
        Promise.all(
          TRIMESTER_RANGES.map((item) => translateText(item.label, language))
        ),
      ]);

      if (!active) return;

      setLabels({
        weekShort,
        trimesters,
      });
    }

    void loadTranslations();

    return () => {
      active = false;
    };
  }, [language]);

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
              relative px-4 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-300 whitespace-nowrap
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
            <span className="relative z-10">
              {labels.trimesters[idx] ?? t.label}
            </span>

            <span className="ml-1.5 text-xs opacity-75">
              ({labels.weekShort} {t.range[0]}–{t.range[1]})
            </span>
          </button>
        );
      })}
    </div>
  );
}