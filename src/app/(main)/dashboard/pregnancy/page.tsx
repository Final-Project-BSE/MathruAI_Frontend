"use client";

import Container from "@/components/shared/container";
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
import { useLanguage } from "@/components/common/useLanguage";

export default function PregnancyPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { loading, error, stats } = usePregnancyStats();
  const { t } = useLanguage();

  return (
    <Container title={t.pregnancy.page.title}>
      <div className="min-h-screen bg-[#fed2cc] p-4 md:p-6">
        <TopBarFeatures />

        <DashboardTopBar
          info={{
            title: t.pregnancy.page.title,
            subtitle: t.pregnancy.page.subtitle,
            ultsubtitle: "",
          }}
          stats={stats}
        />

        {loading && (
          <div className="mb-4 rounded-lg border border-[#d04f51]/20 bg-white p-3 text-sm text-[#d04f51]">
            {t.pregnancy.page.loading}
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