"use client";

import Container from "@/components/shared/container";
import { useEffect, useState } from "react";
import { UpdateDataPopup } from "@/components/update-data-popup";
import DashboardTopBar from "./components/DashboardTopBar";
import { useCycleStats } from "@/hooks/useCycleStats";
import HealthStatusSum from "./components/HealthStatusSum";
import DashboardFeatures from "./components/DashboardFeatures";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import CycleTrackerDashboardCard from "./components/CycleTrackerDashboardCard";
import AnnouncementDashboardCard from "./components/AnnouncementDashboardCard";
import MidwifeConnectivityCard from "./components/MidwifeConnectivityCard";
import { LoadingState } from "@/components/common/LoadingState";

export default function ReproductivePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  const { stats } = useCycleStats();

  useEffect(() => {
    setPageReady(true);
  }, []);

  if (!pageReady) {
    return <LoadingState />;
  }

  return (
    <Container title="Reproductive Planning Dashboard">
      <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
        <TopBarFeatures />

        <DashboardTopBar
          info={{
            title: "Reproductive Planning Dashboard",
            subtitle: "Current Cycle Day",
            ultsubtitle: "Your cycle is looking healthy!",
          }}
          stats={stats}
        />

        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <HealthStatusSum />
          <CycleTrackerDashboardCard />
          <AnnouncementDashboardCard />
          <MidwifeConnectivityCard />
        </div>

        <DashboardFeatures />
      </div>

      <UpdateDataPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </Container>
  );
}