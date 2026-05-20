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

function DashboardTopBar({ info, stats }: DashboardTopBarProps) {
  const [me, setMe] = useState<UserResponseDto | null>(null);
  const { t } = useLanguage();

  const topbannerImageUrl = "/images/pregnancy/preg1.png";

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

  const circleClass = `
    flex items-center justify-center rounded-full
    border border-white/30 bg-white/20 shadow-sm ring-1 ring-white/20
    h-16 w-16
    lg:h-24 lg:w-24
  `;

  const numberClass = `
    text-xl font-extrabold leading-none
    lg:text-3xl
  `;

  return (
    <div className="relative mb-6 min-h-[170px] overflow-hidden rounded-lg bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-4 text-white md:min-h-[190px] md:p-6">
      <img
        src={topbannerImageUrl}
        alt="Banner"
        className="
          pointer-events-none absolute right-0 top-0 h-full
          w-[160px] select-none object-cover opacity-90
          md:w-[160px] lg:w-[160px]
        "
      />

      <div className="relative z-10">
        <h1 className="mb-1 text-xl font-bold md:text-2xl">
          {greeting}, {fullname}
        </h1>

        <div className="text-sm opacity-90">
          {t.dashboard.patientId}: RP-2025-001
        </div>

        {info.subtitle ? (
          <div className="mt-1 text-sm opacity-90">{info.subtitle}</div>
        ) : null}
      </div>

      <div
        className="
          absolute left-1/2 top-1/2 z-10
          flex flex-row -translate-x-1/2 -translate-y-1/2
          items-center gap-4 px-3
          max-[900px]:top-[60%]
          max-[490px]:top-[70%]
        "
      >
        <div className="flex flex-col items-center max-[1150px]:ml-[200px] max-[900px]:ml-[50px] max-[490px]:ml-[-100px]">
          <div className={circleClass}>
            <span className={numberClass}>{stats?.pregnancyWeek ?? "—"}</span>
          </div>

          <div className="mt-2 whitespace-nowrap text-center text-xs font-medium opacity-95">
            {t.pregnancy.topbar.currentWeek}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className={circleClass}>
            <span className={numberClass}>{stats?.daysLeft ?? "—"}</span>
          </div>

          <div className="mt-2 whitespace-nowrap text-center text-xs font-medium opacity-95">
            {t.pregnancy.topbar.daysLeft}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTopBar;