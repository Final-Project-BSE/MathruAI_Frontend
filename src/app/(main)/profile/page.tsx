"use client";

import React from "react";
import ProfileDashboard from "./components/ProfileDashboard";
import Container from "@/components/shared/container";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { useLanguage } from "@/components/common/useLanguage";

const ProfilePage = () => {
  const { t } = useLanguage();

  return (
    <Container title={t.profile.pageTitle}>
      <div className="p-4">
        <TopBarFeatures />
      </div>

      <ProfileDashboard />
    </Container>
  );
};

export default ProfilePage;