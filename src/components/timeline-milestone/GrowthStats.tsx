"use client";

import { useEffect, useState } from "react";
import { Ruler, Weight, Heart, Move } from "lucide-react";
import type { FetalWeekData } from "./fetal-data";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface GrowthStatsProps {
  data: FetalWeekData;
}

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number | null;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === null) {
      setDisplay(0);
      return;
    }

    const duration = 600;
    const start = performance.now();
    const from = display;
    const diff = value - from;

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplay(Math.round(from + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (value === null) {
    return <span className="text-gray-400 text-xs">—</span>;
  }

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

const stats = [
  {
    key: "crownRumpCm" as const,
    label: "Crown-Rump",
    icon: Ruler,
    suffix: " cm",
    color: "#ec4899",
  },
  {
    key: "crownHeelCm" as const,
    label: "Crown-Heel",
    icon: Move,
    suffix: " cm",
    color: "#8b5cf6",
  },
  {
    key: "weightGrams" as const,
    label: "Weight",
    icon: Weight,
    suffix: " g",
    color: "#22c55e",
  },
];

export default function GrowthStats({ data }: GrowthStatsProps) {
  const { language } = useLanguage();

  const [labels, setLabels] = useState({
    crownRump: "Crown-Rump",
    crownHeel: "Crown-Heel",
    weight: "Weight",
    heartRate: "Heart Rate",
    bpm: "bpm",
  });

  useEffect(() => {
    let active = true;

    async function loadTranslations() {
      const [crownRump, crownHeel, weight, heartRate, bpm] =
        await Promise.all([
          translateText("Crown-Rump", language),
          translateText("Crown-Heel", language),
          translateText("Weight", language),
          translateText("Heart Rate", language),
          translateText("bpm", language),
        ]);

      if (!active) return;

      setLabels({
        crownRump,
        crownHeel,
        weight,
        heartRate,
        bpm,
      });
    }

    void loadTranslations();

    return () => {
      active = false;
    };
  }, [language]);

  const labelMap = {
    crownRumpCm: labels.crownRump,
    crownHeelCm: labels.crownHeel,
    weightGrams: labels.weight,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const val = data[stat.key];

        return (
          <div
            key={stat.key}
            className="flex items-center gap-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
              style={{ background: `${stat.color}20`, color: stat.color }}
            >
              <Icon className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] text-gray-500 font-medium">
                {labelMap[stat.key]}
              </p>

              <p className="text-sm font-bold text-gray-800">
                <AnimatedNumber value={val} suffix={stat.suffix} />
              </p>
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm animate-pulse"
          style={{ background: "#ef444420", color: "#ef4444" }}
        >
          <Heart className="h-4 w-4" />
        </div>

        <div>
          <p className="text-[10px] text-gray-500 font-medium">
            {labels.heartRate}
          </p>

          <p className="text-sm font-bold text-gray-800">
            {data.heartRateBpm
              ? `${data.heartRateBpm} ${labels.bpm}`
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}