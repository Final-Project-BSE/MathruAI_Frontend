"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  HeartPulse,
  Loader2,
  Target,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getLatestFertility,
  type FertilityResponseDto,
} from "@/app/api/cycletracker/api";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "Not calculated";

  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

function daysBetween(targetDate?: string | null) {
  if (!targetDate) return null;

  const today = new Date();
  const target = new Date(targetDate);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export default function CycleTrackerDashboardCard() {
  const [fertilityData, setFertilityData] =
    useState<FertilityResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLatestCycleData() {
      try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();
        const token = session?.user?.token;

        if (!token) {
          setError("Please log in to view your cycle tracker.");
          return;
        }

        const latest = await getLatestFertility(token);
        setFertilityData(latest);
      } catch {
        setError("Failed to load cycle tracker data.");
      } finally {
        setLoading(false);
      }
    }

    loadLatestCycleData();
  }, []);

  const nextPeriodDays = daysBetween(fertilityData?.nextPeriodDate);
  const ovulationDays = daysBetween(fertilityData?.ovulationDate);

  return (
    <Card className="bg-white/95 backdrop-blur border-0 shadow-md rounded-2xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-black text-base md:text-lg">
            <HeartPulse className="h-5 w-5 text-[#d04f51]" />
            Cycle Tracker
          </CardTitle>

          <Link href="/cycle-tracker">
            <Button
              size="sm"
              className="bg-[#d04f51] hover:bg-[#d63c3e] text-white text-xs"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-10 text-[#d04f51]">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading cycle data...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && !fertilityData && (
          <div className="rounded-xl bg-pink-50 p-5 text-center">
            <CalendarDays className="mx-auto h-9 w-9 text-[#d04f51] mb-3" />
            <h3 className="font-semibold text-gray-900">
              No cycle data available
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Calculate your fertility window to see your cycle summary here.
            </p>

            <Link href="/cycle-tracker">
              <Button className="mt-4 bg-[#d04f51] text-white">
                Calculate Now
              </Button>
            </Link>
          </div>
        )}

        {!loading && !error && fertilityData && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-pink-50 pl-4 pr-4 pb-1 pt-3">
                <p className="text-xs text-gray-500">Next Period</p>
                <p className="text-md font-bold text-[#d04f51]">
                  {nextPeriodDays !== null && nextPeriodDays >= 0
                    ? `${nextPeriodDays} days`
                    : "Due"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(fertilityData.nextPeriodDate)}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 pl-4 pr-4 pb-1 pt-3">
                <p className="text-xs text-gray-500">Cycle Length</p>
                <p className="text-md font-bold text-[#d04f51]">
                  {fertilityData.averageCycleLength} days
                </p>
                <p className="text-xs text-gray-500">Average</p>
              </div>
            </div>

            <div className="rounded-xl border border-pink-100 pl-4 pr-4 pb-1 pt-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-red-100 p-2">
                  <Target className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Ovulation
                  </p>
                  <p className="text-xs text-gray-600">
                    Expected on {formatDate(fertilityData.ovulationDate)}
                    {ovulationDays !== null && ovulationDays >= 0
                      ? ` • in ${ovulationDays} days`
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-green-100 pl-4 pr-4 pb-1 pt-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Fertile Window
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatDate(fertilityData.fertileWindowStart)} -{" "}
                    {formatDate(fertilityData.fertileWindowEnd)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}