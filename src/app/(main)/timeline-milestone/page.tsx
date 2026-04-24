"use client";

import { useState, useCallback } from "react";
import Container from "@/components/shared/container";
import { Baby } from "lucide-react";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import {
  FETAL_DATA,
  TRIMESTER_RANGES,
} from "@/components/timeline-milestone/fetal-data";
import TrimesterTabs from "@/components/timeline-milestone/TrimesterTabs";
import TimelineRail from "@/components/timeline-milestone/TimelineRail";
import MilestoneCard from "@/components/timeline-milestone/MilestoneCard";
import GrowthStats from "@/components/timeline-milestone/GrowthStats";
import Image from "next/image";
import WeekSearch from "@/components/timeline-milestone/WeekSearch";

export default function TimelineMilestonePage() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [animKey, setAnimKey] = useState(0);

  const weekData =
    FETAL_DATA.find((d) => d.week === selectedWeek) ?? FETAL_DATA[0];
  const activeTrimester = weekData.trimester;

  const handleSelectWeek = useCallback((week: number) => {
    setSelectedWeek(week);
    setAnimKey((k) => k + 1);
  }, []);

  const handleTrimesterSelect = useCallback(
    (trimester: 1 | 2 | 3) => {
      const firstWeek = TRIMESTER_RANGES[trimester - 1].range[0];
      handleSelectWeek(firstWeek);
    },
    [handleSelectWeek],
  );

  return (
    <Container title="Timeline-Milestone">
      {/* Custom animation keyframes */}
      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlideUp {
          animation: fadeSlideUp 500ms ease-out both;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="relative bg-[#fed2cc] min-h-screen p-4 md:p-6 overflow-hidden">
        {/* Subtle background image */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Image
            src="/images/auth-bg.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10">
          <TopBarFeatures />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-300/40">
                <Baby className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                  Fetal Development Timeline
                </h1>
                <p className="text-sm text-gray-500">
                  Track your baby&apos;s growth week by week
                </p>
              </div>
            </div>
          </div>

          {/* Search + Tabs row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <WeekSearch onSelectWeek={handleSelectWeek} totalWeeks={41} />
            <TrimesterTabs
              activeTrimester={activeTrimester}
              onSelect={handleTrimesterSelect}
            />
          </div>

          {/* Timeline Rail */}
          <div className="mb-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm">
            <TimelineRail
              selectedWeek={selectedWeek}
              onSelectWeek={handleSelectWeek}
            />
          </div>

          {/* Growth Stats */}
          <div className="mb-6">
            <GrowthStats data={weekData} />
          </div>

          {/* Milestone Card */}
          <MilestoneCard data={weekData} animKey={animKey} />
        </div>
      </div>
    </Container>
  );
}
