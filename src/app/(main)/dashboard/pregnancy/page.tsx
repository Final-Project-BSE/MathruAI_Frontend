"use client";

import Container from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { UpdateDataPopup } from "@/components/update-data-popup";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import DashboardTopBar from "./components/DashboardTopBar";
import HealthStatusSum from "./components/HealthStatusSum";
import DashboardFeatures from "./components/DashboardFeatures";
import { usePregnancyStats } from "@/hooks/usePregnancyStatus";

export default function PregnancyPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [kickCount, setKickCount] = useState(8);

  const { loading, error, stats } = usePregnancyStats();

  return (
    <Container title="Pregnancy Dashboard">
      <div className="min-h-screen bg-[#fed2cc] p-4 md:p-6">
        <TopBarFeatures />

        <DashboardTopBar
          info={{
            title: "Pregnancy Dashboard",
            subtitle: "Track your progress",
            ultsubtitle: "",
          }}
          stats={stats}
        />

        {loading && (
          <div className="mb-4 rounded-lg border border-[#d04f51]/20 bg-white p-3 text-sm text-[#d04f51]">
            Loading pregnancy data...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-[#d04f51]/20 bg-[#d04f51]/10 p-3 text-sm text-[#d04f51]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <HealthStatusSum />

          <Card className="border-[#d04f51]/20 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#d04f51]">
                Health Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-[#d04f51] pl-4">
                <h4 className="text-sm font-medium text-gray-900">
                  How Sleep Affects Your Fertility
                </h4>
                <p className="text-xs text-gray-600">
                  Quality sleep plays a crucial role in reproductive health and
                  overall hormone balance.
                </p>
              </div>
              <div className="border-l-4 border-[#d04f51] pl-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Nutrition Tips for Conception
                </h4>
                <p className="text-xs text-gray-600">
                  Learn about foods, hydration, and daily habits that support a
                  healthier pregnancy journey.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#d04f51]/20 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#d04f51]">
                Midwife Connectivity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12">
                    <AvatarFallback className="bg-[#d04f51] text-white">
                      SM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Sarah Mitchell, CNM
                    </div>
                    <div className="text-xs text-gray-600">
                      Online • Last seen 2 min ago
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#d04f51] text-xs text-white hover:bg-[#b84345]"
                  >
                    Send Data
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[#d04f51] text-xs text-[#d04f51] hover:bg-[#d04f51]/5"
                  >
                    Ask Question
                  </Button>
                </div>

                <div className="rounded-lg bg-[#d04f51]/10 p-3">
                  <div className="text-xs font-medium text-[#d04f51]">
                    Auto-Alert: Health data automatically shared with care team
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#d04f51]/20 bg-white shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#d04f51]">
                Today Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-[#d04f51]/20 bg-[#d04f51]/5 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-[#d04f51]">
                    Hydration Goal
                  </h4>
                  <p className="text-sm text-gray-700">
                    Drink 8–10 glasses of water today to support circulation,
                    digestion, and amniotic fluid balance.
                  </p>
                </div>

                <div className="rounded-xl border border-[#d04f51]/20 bg-[#d04f51]/5 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-[#d04f51]">
                    Gentle Activity
                  </h4>
                  <p className="text-sm text-gray-700">
                    Take a 20-minute walk or do light stretching to reduce
                    stiffness and improve mood.
                  </p>
                </div>

                <div className="rounded-xl border border-[#d04f51]/20 bg-[#d04f51]/5 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-[#d04f51]">
                    Rest Reminder
                  </h4>
                  <p className="text-sm text-gray-700">
                    Aim for consistent sleep tonight and take breaks during the
                    day if fatigue rises.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#d04f51]/20 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#d04f51]">
                Pregnancy Timeline & Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-[#d04f51]" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Week {stats?.pregnancyWeek ?? "—"}
                    </div>
                    <div className="text-xs text-gray-600">
                      Current stage of pregnancy tracking.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-[#d04f51]/70" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Second Trimester Checkpoint
                    </div>
                    <div className="text-xs text-gray-600">
                      Monitor weight, fetal movement, and energy changes.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-[#d04f51]/40" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Upcoming Milestone
                    </div>
                    <div className="text-xs text-gray-600">
                      Prepare for your next scan, discussion with your provider,
                      and birth planning notes.
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-[#d04f51]/10 p-3 text-xs text-[#d04f51]">
                  Estimated days left: <span className="font-semibold">{stats?.daysLeft ?? "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#d04f51]/20 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#d04f51]">
                Fetal Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-[#d04f51]/5 p-4">
                <div className="mb-1 text-sm font-semibold text-[#d04f51]">
                  This Week’s Growth
                </div>
                <p className="text-sm text-gray-700">
                  Your baby is continuing to grow rapidly, with stronger
                  movements, improved coordination, and ongoing organ
                  development.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#d04f51]/20 p-3">
                  <div className="text-xs text-gray-500">Movement</div>
                  <div className="text-sm font-medium text-gray-900">
                    More noticeable kicks
                  </div>
                </div>
                <div className="rounded-lg border border-[#d04f51]/20 p-3">
                  <div className="text-xs text-gray-500">Growth</div>
                  <div className="text-sm font-medium text-gray-900">
                    Steady weekly progress
                  </div>
                </div>
                <div className="rounded-lg border border-[#d04f51]/20 p-3">
                  <div className="text-xs text-gray-500">Senses</div>
                  <div className="text-sm font-medium text-gray-900">
                    Hearing and response improving
                  </div>
                </div>
                <div className="rounded-lg border border-[#d04f51]/20 p-3">
                  <div className="text-xs text-gray-500">Focus</div>
                  <div className="text-sm font-medium text-gray-900">
                    Brain and body coordination
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#d04f51]/20 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#d04f51]">
                Nutrition & Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-[#d04f51]/20 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-gray-900">
                    Today’s Focus Nutrients
                  </h4>
                  <p className="text-xs text-gray-600">
                    Iron, calcium, folate, protein, and omega-3 support your
                    energy and baby’s development.
                  </p>
                </div>

                <div className="rounded-lg border border-[#d04f51]/20 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-gray-900">
                    Wellness Reminder
                  </h4>
                  <p className="text-xs text-gray-600">
                    Balance meals with fruits, leafy greens, whole grains, and
                    adequate hydration throughout the day.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#d04f51]/10 px-3 py-1 text-xs font-medium text-[#d04f51]">
                    Iron-rich foods
                  </span>
                  <span className="rounded-full bg-[#d04f51]/10 px-3 py-1 text-xs font-medium text-[#d04f51]">
                    Calcium intake
                  </span>
                  <span className="rounded-full bg-[#d04f51]/10 px-3 py-1 text-xs font-medium text-[#d04f51]">
                    Protein balance
                  </span>
                  <span className="rounded-full bg-[#d04f51]/10 px-3 py-1 text-xs font-medium text-[#d04f51]">
                    Daily hydration
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#d04f51]/20 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#d04f51]">
                Kick Counter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-3xl font-bold text-[#d04f51]">
                    {kickCount}
                  </div>
                  <div className="text-xs text-gray-600">
                    Kicks tracked today
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-[#d04f51] text-white hover:bg-[#b84345]"
                    onClick={() => setKickCount((prev) => prev + 1)}
                  >
                    Add Kick
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#d04f51] text-[#d04f51] hover:bg-[#d04f51]/5"
                    onClick={() => setKickCount(0)}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-[#d04f51]/10 p-3 text-xs text-[#d04f51]">
                Tip: Try counting kicks during the time of day when your baby is
                usually most active.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <DashboardFeatures />
        </div>
      </div>

      <UpdateDataPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </Container>
  );
}