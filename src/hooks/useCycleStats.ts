"use client";

import { useEffect, useMemo, useState } from "react";
import { getLatestFertility, type FertilityResponseDto } from "@/app/api/cycletracker/api";
import { calcStats, type CycleStats } from "@/lib/cycleTrackerStats";

export function useCycleStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fertilityData, setFertilityData] = useState<FertilityResponseDto | null>(null);
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);

  // Read saved inputs
  useEffect(() => {
    const savedLast = localStorage.getItem("ct_lastPeriodDate");
    const savedLen = localStorage.getItem("ct_cycleLength");
    if (savedLast) setLastPeriodDate(savedLast);
    if (savedLen) setCycleLength(Number(savedLen));
  }, []);

  // Fetch latest fertilityData
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();

        const token = session?.user?.token;
        if (!token) {
          setError("Not authenticated");
          setFertilityData(null);
          return;
        }

        const latest = await getLatestFertility(token);
        setFertilityData(latest ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load cycle stats");
        setFertilityData(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const stats: CycleStats = useMemo(() => {
    if (!fertilityData) return { currentDay: 0, cycleLength, nextPeriod: 0, fertile: 0 };
    return calcStats({ fertilityData, lastPeriodDate, cycleLength });
  }, [fertilityData, lastPeriodDate, cycleLength]);

  return { loading, error, fertilityData, stats };
}