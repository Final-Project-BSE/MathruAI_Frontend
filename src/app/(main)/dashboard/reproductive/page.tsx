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
import { useLanguage } from "../../../../components/common/useLanguage";

export default function ReproductivePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  const { stats } = useCycleStats();
  const { t } = useLanguage();

  useEffect(() => {
    setPageReady(true);
  }, []);

  if (!pageReady) {
    return <LoadingState />;
  }

  return (
    <Container title={t.reproductive.dashboard.title}>
      <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
        <TopBarFeatures />

        <DashboardTopBar
          info={{
            title: t.reproductive.dashboard.title,
            subtitle: t.reproductive.dashboard.subtitle,
            ultsubtitle: t.reproductive.dashboard.healthyMessage,
          }}
          stats={stats}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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