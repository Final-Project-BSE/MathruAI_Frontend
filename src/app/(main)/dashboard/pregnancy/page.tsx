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
import { usePregnancyStats } from "@/hooks/usePregnancyStatus";
import TodaysRecommendation from "./components/TodaysRecommendation";
import TimelineMilestoneSummaryCard from "./components/TimelineMilestoneSummaryCard";
import MidwifeConnectivityCard from "../reproductive/components/MidwifeConnectivityCard";
import AnnouncementDashboardCard from "../reproductive/components/AnnouncementDashboardCard";
import DashboardFeatures from "../reproductive/components/DashboardFeatures";

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

          <TimelineMilestoneSummaryCard
            pregnancyWeek={stats?.pregnancyWeek}
            daysLeft={stats?.daysLeft}
          />

          <TodaysRecommendation href="/daily-recommendations" />

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

          <MidwifeConnectivityCard />

          <AnnouncementDashboardCard />
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