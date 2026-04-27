"use client";

import { useState } from "react";
import Container from "@/components/shared/container";
import { UpdateDataPopup } from "@/components/update-data-popup";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import DashboardTopBar from "./components/DashboardTopBar";
import HealthStatusSum from "./components/HealthStatusSum";
import { usePregnancyStats } from "@/hooks/usePregnancyStatus";
import MidwifeConnectivityCard from "../reproductive/components/MidwifeConnectivityCard";
import AnnouncementDashboardCard from "../reproductive/components/AnnouncementDashboardCard";
import DashboardFeatures from "../reproductive/components/DashboardFeatures";
import RecoveryTrackingDashboardCard from "./components/RecoveryTrackingDashboardCard";

export default function PostpartumPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { loading, error, stats } = usePregnancyStats();

  return (
    <Container title="Postpartum Dashboard">
      <div className="min-h-screen bg-[#fed2cc] p-4 md:p-6">
        <TopBarFeatures />

        <DashboardTopBar
          info={{
            title: "Postpartum Dashboard",
            subtitle: "Track your recovery progress",
            ultsubtitle: "",
          }}
          stats={stats}
        />

        {loading && (
          <div className="mb-4 rounded-lg border border-[#d04f51]/20 bg-white p-3 text-sm text-[#d04f51]">
            Loading postpartum data...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-[#d04f51]/20 bg-[#d04f51]/10 p-3 text-sm text-[#d04f51]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <HealthStatusSum />

          <RecoveryTrackingDashboardCard />

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