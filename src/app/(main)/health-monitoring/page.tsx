"use client";

import React from "react";
import MaternalHealthDashboard from "./components/MaternalHealthDashboard";
import Container from "@/components/shared/container";
import { useLanguage } from "@/components/common/useLanguage";

const HealthMonitorPage = () => {
  const { t } = useLanguage();

  return (
    <Container title={t.healthMonitor.pageTitle}>
      <MaternalHealthDashboard />
    </Container>
  );
};

export default HealthMonitorPage;