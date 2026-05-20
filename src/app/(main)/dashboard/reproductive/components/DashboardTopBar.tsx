"use client";

import { useEffect, useMemo, useState } from "react";
import { getcuruser } from "@/app/api/user/api";
import type { UserResponseDto } from "@/app/api/user/types";
import { useLanguage } from "../../../../../components/common/useLanguage";

type CycleStats = {
  currentDay: number;
  cycleLength: number;
  nextPeriod: number;
  fertile: number;
};

type TopBarInfo = {
  title: string;
  subtitle: string;
  ultsubtitle: string;
};

type DashboardTopBarProps = {
  info: TopBarInfo;
  stats?: CycleStats;
};

function DashboardTopBar({ info, stats }: DashboardTopBarProps) {
  const [me, setMe] = useState<UserResponseDto | null>(null);
  const { t } = useLanguage();

  const topbannerImageUrl = "/images/reproductive/repro1.png";

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

    loadMe();
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
          md:w-[240px] lg:w-[300px]
        "
      />

      <div className="relative z-10">
        <h1 className="mb-1 text-xl font-bold md:text-2xl">
          {greeting}, {fullname}
        </h1>
        <div className="text-sm opacity-90">
          {t.dashboard.patientId}: RP-2025-001
        </div>
      </div>

      <div
        className="
          absolute left-1/2 top-1/2 z-10
          flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 px-3
          sm:flex-row
        "
      >
        <div className="flex flex-col items-center">
          <div
            className="
              flex h-20 w-20 items-center justify-center rounded-full
              border border-white/30 bg-white/20 shadow-sm ring-1 ring-white/20
              md:h-24 md:w-24
            "
          >
            <span className="text-3xl font-extrabold leading-none md:text-4xl">
              {stats?.currentDay ?? "—"}
            </span>
          </div>

          <div className="mt-2 text-center text-xs opacity-90">
            {info.subtitle}
          </div>

          <div className="flex flex-col text-center text-[11px] opacity-95">
            <div>
              {t.reproductive.dashboard.nextPeriodIn}{" "}
              <span className="font-semibold text-white">
                {stats?.nextPeriod ?? "—"} {t.dashboard.days}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTopBar;