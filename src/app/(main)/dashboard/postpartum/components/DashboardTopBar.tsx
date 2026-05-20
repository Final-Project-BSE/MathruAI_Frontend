"use client";

import { useEffect, useMemo, useState } from "react";
import { getcuruser } from "@/app/api/user/api";
import type { UserResponseDto } from "@/app/api/user/types";
import { useLanguage } from "@/components/common/useLanguage";

type PregnancyStats = {
  pregnancyWeek: number;
  daysLeft: number;
};

type TopBarInfo = {
  title: string;
  subtitle: string;
  ultsubtitle: string;
};

type DashboardTopBarProps = {
  info: TopBarInfo;
  stats?: PregnancyStats;
};

function DashboardTopBar({ info }: DashboardTopBarProps) {
  const [me, setMe] = useState<UserResponseDto | null>(null);
  const { t } = useLanguage();

  const topbannerImageUrl = "/images/postpartum/postpartumtop.png";

  useEffect(() => {
    const loadMe = async () => {
      try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();

        const token = session?.user?.token;
        if (!token) return;

        const user = await getcuruser(token);
        setMe(user);
      } catch (e) {
        console.error("Failed to load current user:", e);
      }
    };

    void loadMe();
  }, []);

  const fullname = useMemo(() => {
    if (!me) return "—";
    return me.firstName || "—";
  }, [me]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return t.dashboard.goodMorning;
    if (hour >= 12 && hour < 17) return t.dashboard.goodAfternoon;
    if (hour >= 17 && hour < 21) return t.dashboard.goodEvening;
    return t.dashboard.goodNight;
  }, [t]);

  return (
    <div className="relative mb-6 min-h-[170px] overflow-hidden rounded-lg bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-4 text-white md:min-h-[190px] md:p-6">
      <img
        src={topbannerImageUrl}
        alt="Banner"
        className="
          pointer-events-none absolute right-0 top-0 h-full
          w-[180px] select-none object-cover opacity-90
          md:w-[180px] lg:w-[180px]
        "
      />

      <div className="relative z-10">
        <h1 className="mb-1 text-xl font-bold md:text-2xl">
          {greeting}, {fullname}
        </h1>

        <div className="text-sm opacity-90">
          {t.dashboard.patientId}: RP-2025-001
        </div>

        <div className="mt-2 max-w-[320px] text-sm font-medium opacity-95">
          {info.subtitle}
        </div>
      </div>
    </div>
  );
}

export default DashboardTopBar;