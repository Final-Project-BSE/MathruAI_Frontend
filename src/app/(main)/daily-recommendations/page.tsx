"use client";

import React from "react";
import DailyRecommendationDashboard from "./components/DailyRecommendationDashboard";
import Container from "@/components/shared/container";
import { useLanguage } from "@/components/common/useLanguage";

const DailyRecommendationsPage = () => {
  const { t } = useLanguage();

  return (
    <Container title={t.dailyRecommendation.pageTitle}>
      <DailyRecommendationDashboard />
    </Container>
  );
};

export default DailyRecommendationsPage;