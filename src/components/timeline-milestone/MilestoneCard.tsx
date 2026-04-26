"use client";

import Image from "next/image";
import { TRIMESTER_RANGES, type FetalWeekData } from "./fetal-data";
import FetalIllustration from "./FetalIllustration";
import { Baby, Brain, Heart, Eye, Bone, Sparkles, Info } from "lucide-react";

interface MilestoneCardProps {
  data: FetalWeekData;
  animKey: number;
}

const DEV_ICONS = [Brain, Heart, Eye, Bone, Sparkles, Baby];

export default function MilestoneCard({ data, animKey }: MilestoneCardProps) {
  const trimesterInfo = TRIMESTER_RANGES[data.trimester - 1];

  return (
    <div
      key={animKey}
      className="animate-fadeSlideUp"
      style={{ animationDuration: "500ms", animationFillMode: "both" }}
    >
      {/* Background image card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/30">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/ima"
            alt="Background"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
        </div>

        {/* Glass overlay */}
        <div
          className="relative backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.65), ${data.color}15)`,
          }}
        >
          <div className="flex flex-col lg:flex-row gap-6 p-6 md:p-8">
            {/* Left column — illustration */}
            <div className="flex flex-col items-center justify-center lg:w-[280px] shrink-0">
              <FetalIllustration
                week={data.week}
                emoji={data.emoji}
                sizeComparison={data.sizeComparison}
                color={data.color}
                image={data.image}
              />
            </div>

            {/* Right column — details */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Header badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: trimesterInfo.color }}
                >
                  {trimesterInfo.label}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 text-gray-700 border border-gray-200">
                  Week {data.week} · Month {data.month.toFixed(1)}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    borderColor: data.color,
                    color: data.color,
                    background: `${data.color}10`,
                  }}
                >
                  {data.stage}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              {data.title}
              </h2>

              {/* Developments */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Key Developments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.developments.map((dev, i) => {
                    const Icon = DEV_ICONS[i % DEV_ICONS.length];
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 px-3 py-2.5 text-sm text-gray-700 shadow-sm"
                      >
                        <Icon
                          className="h-4 w-4 mt-0.5 shrink-0"
                          style={{ color: data.color }}
                        />
                        <span>{dev}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Body & Hair growth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                    <Bone className="h-3.5 w-3.5 text-orange-500" /> Body Growth
                  </h4>
                  <p className="text-sm text-gray-700">{data.bodyGrowth}</p>
                </div>
                <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Hair &
                    Skin
                  </h4>
                  <p className="text-sm text-gray-700">{data.hairGrowth}</p>
                </div>
              </div>

              {/* Fun fact callout */}
              <div
                className="flex items-start gap-3 rounded-2xl p-4 border"
                style={{
                  background: `${data.color}08`,
                  borderColor: `${data.color}30`,
                }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full shrink-0"
                  style={{ background: `${data.color}20`, color: data.color }}
                >
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <p
                    className="text-xs font-bold mb-0.5"
                    style={{ color: data.color }}
                  >
                    Did you know?
                  </p>
                  <p className="text-sm text-gray-600">
                    At week {data.week}, your baby is about the size of a{" "}
                    {data.sizeComparison.toLowerCase()}
                    {data.weightGrams
                      ? ` and weighs approximately ${data.weightGrams >= 1000 ? `${(data.weightGrams / 1000).toFixed(1)} kg` : `${data.weightGrams} grams`}`
                      : ""}
                    !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
