"use client";

import { useEffect, useState } from "react";
import { FETAL_DATA, TRIMESTER_RANGES } from "./fetal-data";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface TimelineRailProps {
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
}

export default function TimelineRail({
  selectedWeek,
  onSelectWeek,
}: TimelineRailProps) {
  const { language } = useLanguage();

  const [weekLabel, setWeekLabel] = useState("Week");
  const [translatedTitles, setTranslatedTitles] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    let active = true;

    async function loadTranslations() {
      const [translatedWeek, titlePairs] = await Promise.all([
        translateText("Week", language),
        Promise.all(
          FETAL_DATA.map(async (item) => {
            const translated = await translateText(item.title, language);
            return [item.week, translated] as const;
          })
        ),
      ]);

      if (!active) return;

      setWeekLabel(translatedWeek);
      setTranslatedTitles(Object.fromEntries(titlePairs));
    }

    void loadTranslations();

    return () => {
      active = false;
    };
  }, [language]);

  const getTrimesterColor = (trimester: 1 | 2 | 3) => {
    return TRIMESTER_RANGES[trimester - 1].color;
  };

  return (
    <div className="w-full max-w-full min-w-0">
      <div
        className="
          grid w-full min-w-0 gap-2 p-3
          grid-cols-4
          min-[420px]:grid-cols-5
          sm:grid-cols-7
          md:grid-cols-9
          lg:grid-cols-11
          xl:grid-cols-14
          2xl:grid-cols-16
        "
      >
        {FETAL_DATA.map((weekData) => {
          const isSelected = weekData.week === selectedWeek;
          const color = getTrimesterColor(weekData.trimester);

          return (
            <button
              key={weekData.week}
              type="button"
              onClick={() => onSelectWeek(weekData.week)}
              className={`
                relative flex min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2 transition-all duration-300
                ${
                  isSelected
                    ? "text-white shadow-lg scale-[1.04]"
                    : "border border-white/50 bg-white/60 text-gray-600 hover:bg-white hover:shadow-md hover:scale-[1.03]"
                }
              `}
              style={
                isSelected
                  ? {
                      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                      boxShadow: `0 4px 20px ${color}50`,
                    }
                  : undefined
              }
              title={translatedTitles[weekData.week] ?? weekData.title}
              id={`week-pill-${weekData.week}`}
              aria-label={`${weekLabel} ${weekData.week}`}
            >
              <span className="text-xs font-bold leading-none">
                W{weekData.week}
              </span>

              <span className="text-[10px] leading-none opacity-75">
                {weekData.emoji}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}