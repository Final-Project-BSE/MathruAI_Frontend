"use client";

import Image from "next/image";

interface FetalIllustrationProps {
  week: number;
  emoji: string;
  sizeComparison: string;
  color: string;
  image?: string;
  labels?: {
    sizeOfA: string;
    week: string;
    of: string;
  };
}

export default function FetalIllustration({
  week,
  sizeComparison,
  color,
  image,
  labels = {
    sizeOfA: "Size of a",
    week: "Week",
    of: "of",
  },
}: FetalIllustrationProps) {
  const scale = 0.4 + (week / 41) * 0.6;

  return (
    <div className="relative flex flex-col items-center justify-center gap-3">
      <div
        className="absolute rounded-full blur-3xl opacity-30 animate-pulse"
        style={{
          width: `${120 * scale}px`,
          height: `${120 * scale}px`,
          background: `radial-gradient(circle, ${color}, transparent)`,
        }}
      />

      <div
        className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-white/40 transition-all duration-500"
        style={{
          width: `${Math.max(250, 300 * scale)}px`,
          height: `${Math.max(250, 300 * scale)}px`,
        }}
      >
        <Image
          src={image || "/images/auth-bg.png"}
          alt={`${labels.week} ${week} fetal development`}
          fill
          className="object-cover"
          sizes="260px"
        />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color}40, ${color}20)`,
          }}
        />
      </div>

      <div
        className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, ${color}cc, ${color})`,
          boxShadow: `0 2px 10px ${color}40`,
        }}
      >
        {labels.sizeOfA} {sizeComparison}
      </div>

      <div className="w-full max-w-[180px]">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-medium">
          <span>
            {labels.week} {week}
          </span>
          <span>{labels.of} 41</span>
        </div>

        <div className="h-2 rounded-full bg-gray-200/60 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(week / 41) * 100}%`,
              background: `linear-gradient(90deg, ${color}aa, ${color})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}