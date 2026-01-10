"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  Lightbulb,
  Loader2,
  Calendar,
  AlertTriangle,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const FERTILITY_API = `${API_BASE_URL}/api/fertility`;

interface FertilityResponseDto {
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
  nextPeriodDate: string;
  pregnancyTestDay: string;
}

interface CycleDay {
  date: number;
  isCurrentDay: boolean;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  isToday: boolean;
}

export default function CycleTracker() {
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

  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();

        if (session?.user?.token) {
          setToken(session.user.token);
          setIsAuthenticated(true);
          await loadExistingData(session.user.token);
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

  useEffect(() => {
    if (fertilityData) generateCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fertilityData, currentMonth]);

  async function loadExistingData(jwtToken: string) {
    try {
      const response = await fetch(`${FERTILITY_API}/latest`, {
        method: "GET",
        credentials: "omit",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFertilityData(data);
        setError(null);
      }
    } catch {
      // ignore - no existing data
    }
  }

  useEffect(() => {
    const savedLast = localStorage.getItem("ct_lastPeriodDate");
    const savedLen = localStorage.getItem("ct_cycleLength");
    if (savedLast) setLastPeriodDate(savedLast);
    if (savedLen) setCycleLength(Number(savedLen));
  }, []);

  async function handleCalculate() {
    console.log("Sending request to:", `${FERTILITY_API}/calculate`, {
      lastPeriodDate,
      averageCycleLength: cycleLength,
    });

    if (!lastPeriodDate) {
      setError("Please enter your last period date");
      return;
    }

    if (!token) {
      setError("Please log in to calculate fertility window");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(`${FERTILITY_API}/calculate`, {
        method: "POST",
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lastPeriodDate,
          averageCycleLength: cycleLength,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || "Failed to calculate fertility");
      }

      const data = await response.json();
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

  function generateCalendar() {
    if (!fertilityData) return;

    const days: CycleDay[] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const lastPeriod = new Date(lastPeriodDate || fertilityData.nextPeriodDate);
    const periodDuration = 5;

    const fertileStart = new Date(fertilityData.fertileWindowStart);
    const fertileEnd = new Date(fertilityData.fertileWindowEnd);
    const ovulation = new Date(fertilityData.ovulationDate);
    const nextPeriod = new Date(fertilityData.nextPeriodDate);

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);

      const isPeriod =
        (currentDate >= lastPeriod &&
          currentDate < new Date(lastPeriod.getTime() + periodDuration * 24 * 60 * 60 * 1000)) ||
        (currentDate >= nextPeriod &&
          currentDate < new Date(nextPeriod.getTime() + periodDuration * 24 * 60 * 60 * 1000));

      const isFertile = currentDate >= fertileStart && currentDate <= fertileEnd;
      const isOvulation = currentDate.toDateString() === ovulation.toDateString();
      const isToday = currentDate.toDateString() === today.toDateString();

      days.push({
        date: i,
        isCurrentDay: isToday,
        isPeriod,
        isFertile,
        isOvulation,
        isToday,
      });
    }

    setCalendarDays(days);
  }

  function getDayClassName(day: CycleDay) {
    if (day.isOvulation) return "bg-red-500 text-white font-bold";
    if (day.isPeriod) return "bg-red-100 text-red-700";
    if (day.isFertile) return "bg-pink-100 text-pink-700";
    if (day.isToday) return "bg-gray-800 text-white";
    return "bg-white text-gray-700 hover:bg-gray-100";
  }

  function deriveLastPeriod(nextPeriodISO: string, len: number) {
    const d = new Date(nextPeriodISO);
    d.setDate(d.getDate() - len);
    return d;
  }

  function calculateStats() {
    if (!fertilityData) return { currentDay: 0, cycleLength, nextPeriod: 0, fertile: 0 };

    const today = new Date();
    const lastPeriod = lastPeriodDate
      ? new Date(`${lastPeriodDate}T00:00:00`) // important: avoid timezone shift
      : deriveLastPeriod(fertilityData.nextPeriodDate, cycleLength);

    const nextPeriod = new Date(fertilityData.nextPeriodDate);
    const fertileEnd = new Date(fertilityData.fertileWindowEnd);

    const currentDay = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysToNextPeriod = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysToFertileEnd = Math.max(0, Math.ceil((fertileEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      currentDay: Math.max(0, currentDay),
      cycleLength,
      nextPeriod: Math.max(0, daysToNextPeriod),
      fertile: daysToFertileEnd,
    };
  }


  function formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const stats = calculateStats();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const displayMonth = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
            <span className="text-gray-700">Loading cycle tracker...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <Calendar className="h-6 w-6 mr-2 text-pink-500" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-pink-200 bg-pink-50">
              <AlertTriangle className="h-4 w-4 text-pink-600" />
              <AlertDescription className="text-pink-800 ml-2">
                {error || "Please log in to access the Cycle Tracker"}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cycle Tracker</h1>
        <p className="text-gray-700">Track your cycle and fertility window</p>
      </div>

      {!fertilityData && (
        <Card className="bg-white/90 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle>Calculate Your Fertility Window</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lastPeriod">Last Period Start Date</Label>
              <Input
                id="lastPeriod"
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                max={formatDateForApi(new Date())}
              />
            </div>
            <div>
              <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
              <Input
                id="cycleLength"
                type="number"
                min="21"
                max="35"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Fertility window calculated successfully!
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleCalculate} disabled={loading} className="w-full bg-red-500 hover:bg-red-600">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Fertility Window"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {fertilityData && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500 mb-1">{stats.currentDay}</div>
                <div className="text-sm text-gray-600">Current Day</div>
                <div className="text-xs text-gray-500">Period of cycle</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">{stats.cycleLength}</div>
                <div className="text-sm text-gray-600">Cycle Length</div>
                <div className="text-xs text-gray-500">Average</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">{stats.nextPeriod}</div>
                <div className="text-sm text-gray-600">Next Period</div>
                <div className="text-xs text-gray-500">Days left</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-500 mb-1">{stats.fertile}</div>
                <div className="text-sm text-gray-600">Fertile Days</div>
                <div className="text-xs text-gray-500">Remaining</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">{displayMonth}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mt-4">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay())].map((_, i) => (
                      <div key={`empty-${i}`} className="p-3"></div>
                    ))}

                    {calendarDays.map((day) => (
                      <button
                        key={day.date}
                        className={`p-3 text-sm rounded-lg border transition-colors ${getDayClassName(day)}`}
                      >
                        {day.date}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-6 text-xs flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-100 rounded border"></div>
                      <span className="text-gray-600">Period</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-100 rounded border"></div>
                      <span className="text-gray-600">Fertile Window</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-gray-600">Ovulation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-800 rounded"></div>
                      <span className="text-gray-600">Today</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setFertilityData(null);
                      setLastPeriodDate("");
                    }}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Recalculate
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Cycle Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full mt-1">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Ovulation</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Expected on {new Date(fertilityData.ovulationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-full mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Fertile Window</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {new Date(fertilityData.fertileWindowStart).toLocaleDateString()} -{" "}
                        {new Date(fertilityData.fertileWindowEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-full mt-1">
                      <Lightbulb className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Next Period</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Expected around {new Date(fertilityData.nextPeriodDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-100 rounded-full mt-1">
                      <Calendar className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Pregnancy Test</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Best to test after {new Date(fertilityData.pregnancyTestDay).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
