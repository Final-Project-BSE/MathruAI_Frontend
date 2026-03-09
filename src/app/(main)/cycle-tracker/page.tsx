"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LoadingState } from "../../../components/common/LoadingState";
import { AuthRequired } from "./components/AuthRequired";
import { CalculatorCard } from "./components/CalculatorCard";
import { StatsGrid, type CycleStats } from "./components/StatsGrid";
import { CycleCalendar, type CycleDay } from "./components/CycleCalendar";
import { CycleInsights } from "./components/CycleInsights";
import Container from "@/components/shared/container";
import { calcStats, generateFutureCycles } from "@/lib/cycleTrackerStats";
import { calculateFertility, getLatestFertility, type FertilityResponseDto } from "../../api/cycletracker/api";

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildCalendarDays(params: {
  year: number;
  month: number;
  lastPeriodDate: string;
  cycleLength: number;
  periodDuration?: number; // default 5 days
}): CycleDay[] {
  const { year, month, lastPeriodDate, cycleLength, periodDuration = 5 } = params;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futurePeriods = generateFutureCycles(lastPeriodDate, cycleLength); // 12 future periods
  const days: CycleDay[] = [];
  const addDays = (date: Date, n: number) => new Date(date.getTime() + n * 86400000);

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    const isPeriod = futurePeriods.some(
      (fp) => currentDate >= fp && currentDate < addDays(fp, periodDuration)
    );
    const isFertile = futurePeriods.some((fp) => {
      const fertileStart = addDays(fp, cycleLength - 14);
      const fertileEnd = addDays(fertileStart, 6);
      return currentDate >= fertileStart && currentDate <= fertileEnd;
    });
    const isOvulation = futurePeriods.some((fp) => {
      const ovulationDay = addDays(fp, cycleLength - 14);
      return currentDate.toDateString() === ovulationDay.toDateString();
    });
    const isToday = currentDate.toDateString() === today.toDateString();

    days.push({ date: i, isPeriod, isFertile, isOvulation, isToday });
  }

  return days;
}

export default function CycleTrackerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [fertilityData, setFertilityData] = useState<FertilityResponseDto | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CycleDay[]>([]);

  // Load saved data
  useEffect(() => {
    const savedLast = localStorage.getItem("ct_lastPeriodDate");
    const savedLen = localStorage.getItem("ct_cycleLength");
    if (savedLast) setLastPeriodDate(savedLast);
    if (savedLen) setCycleLength(Number(savedLen));
  }, []);

  // Authentication
  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();
        if (session?.user?.token) {
          setToken(session.user.token);
          setIsAuthenticated(true);

          const latest = await getLatestFertility(session.user.token);
          if (latest) setFertilityData(latest);
        } else {
          setError("Please log in to access the cycle tracker.");
          setIsAuthenticated(false);
        }
      } catch {
        setError("Authentication error. Please log in again.");
        setIsAuthenticated(false);
      } finally {
        setLoadingData(false);
      }
    };
    initialize();
  }, []);

  // Build calendar when month or data changes
  useEffect(() => {
    if (!lastPeriodDate) return;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    setCalendarDays(
      buildCalendarDays({ year, month, lastPeriodDate, cycleLength })
    );
  }, [lastPeriodDate, cycleLength, currentMonth]);

  const stats = useMemo(() => {
    if (!fertilityData) return { currentDay: 0, cycleLength, nextPeriod: 0, fertile: 0 };
    return calcStats({ fertilityData, lastPeriodDate, cycleLength });
  }, [fertilityData, lastPeriodDate, cycleLength]);

  const displayMonth = `${currentMonth.toLocaleString("default", { month: "long" })} ${currentMonth.getFullYear()}`;
  const leadingEmptyDays = useMemo(() => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(), [currentMonth]);

  async function handleCalculate() {
    if (!lastPeriodDate) return setError("Please enter your last period date");
    if (!token) return setError("Please log in to calculate fertility window");

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const data = await calculateFertility(token, { lastPeriodDate, averageCycleLength: cycleLength });
      setFertilityData(data);

      localStorage.setItem("ct_lastPeriodDate", lastPeriodDate);
      localStorage.setItem("ct_cycleLength", String(cycleLength));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate fertility window");
    } finally {
      setLoading(false);
    }
  }

  function handleRecalculate() {
    setFertilityData(null);
    setLastPeriodDate("");
    setCalendarDays([]);
  }

  if (loadingData) return <LoadingState />;
  if (!isAuthenticated) return <AuthRequired message={error || "Please log in"} />;

  return (
    <Container title="Cycle Tracker">
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cycle Tracker</h1>
        <p className="text-gray-700 mb-6">Track your cycle and fertility window</p>

        {!fertilityData && (
          <CalculatorCard
            lastPeriodDate={lastPeriodDate}
            cycleLength={cycleLength}
            onLastPeriodDateChange={setLastPeriodDate}
            onCycleLengthChange={setCycleLength}
            onCalculate={handleCalculate}
            loading={loading}
            error={error}
            success={success}
            maxDate={formatDateForApi(new Date())}
          />
        )}

        {fertilityData && (
          <>
            <StatsGrid stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CycleCalendar
                  displayMonth={displayMonth}
                  leadingEmptyDays={leadingEmptyDays}
                  days={calendarDays}
                  onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  onRecalculate={handleRecalculate}
                />
              </div>
              <CycleInsights fertilityData={fertilityData} />
            </div>
          </>
        )}
      </div>
    </Container>
  );
}