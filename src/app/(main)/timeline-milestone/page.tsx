"use client";

import { useEffect, useState, useCallback } from "react";
import Container from "@/components/shared/container";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { LoadingState } from "@/components/common/LoadingState";
import {
  FETAL_DATA,
  TRIMESTER_RANGES,
} from "@/components/timeline-milestone/fetal-data";
import TrimesterTabs from "@/components/timeline-milestone/TrimesterTabs";
import TimelineRail from "@/components/timeline-milestone/TimelineRail";
import MilestoneCard from "@/components/timeline-milestone/MilestoneCard";
import GrowthStats from "@/components/timeline-milestone/GrowthStats";
import WeekSearch from "@/components/timeline-milestone/WeekSearch";
import { usePregnancyStats } from "@/hooks/usePregnancyStatus";

export default function TimelineMilestonePage() {
  const { loading, error, stats } = usePregnancyStats();

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (!stats?.pregnancyWeek) return;

    const currentWeek = Math.max(1, Math.min(stats.pregnancyWeek, 41));

    setSelectedWeek(currentWeek);
    setAnimKey((k) => k + 1);
  }, [stats?.pregnancyWeek]);

  const weekData =
    FETAL_DATA.find((d) => d.week === selectedWeek) ?? FETAL_DATA[0];

  const activeTrimester = weekData.trimester;

  const handleSelectWeek = useCallback((week: number) => {
    const clampedWeek = Math.max(1, Math.min(week, 41));

    setSelectedWeek(clampedWeek);
    setAnimKey((k) => k + 1);
  }, []);

  const handleTrimesterSelect = useCallback(
    (trimester: 1 | 2 | 3) => {
      const firstWeek = TRIMESTER_RANGES[trimester - 1].range[0];
      handleSelectWeek(firstWeek);
    },
    [handleSelectWeek]
  );

  if (loading) {
    return (
      <Container title="Timeline-Milestone">
        <div className="min-h-screen bg-[#fcd4cd]">
          <LoadingState />
        </div>
      </Container>
    );
  }

  return (
    <Container title="Timeline-Milestone">
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

      <div className="relative min-h-screen overflow-hidden bg-[#fed2cc] p-4 md:p-6">
        <div className="absolute inset-0 pointer-events-none opacity-5" />

        <div className="relative z-10">
          <TopBarFeatures />

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 md:text-2xl">
                Fetal Development Timeline
              </h1>
              <p className="text-sm text-gray-500">
                Track your baby&apos;s growth week by week
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-[#d04f51]/20 bg-[#d04f51]/10 p-3 text-sm text-[#d04f51]">
              {error}
            </div>
          )}

          <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <WeekSearch onSelectWeek={handleSelectWeek} totalWeeks={41} />

            <TrimesterTabs
              activeTrimester={activeTrimester}
              onSelect={handleTrimesterSelect}
            />
          </div>

          <div className="mb-6 rounded-2xl border border-white/40 bg-white/30 shadow-sm backdrop-blur-sm">
            <TimelineRail
              selectedWeek={selectedWeek}
              onSelectWeek={handleSelectWeek}
            />
          </div>

          <div className="mb-6">
            <GrowthStats data={weekData} />
          </div>

          <MilestoneCard data={weekData} animKey={animKey} />
        </div>
      </div>
    </Container>
  );
}