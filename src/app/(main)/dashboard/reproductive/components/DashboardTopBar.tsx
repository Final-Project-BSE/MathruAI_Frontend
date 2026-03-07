"use client";

import { useEffect, useMemo, useState } from "react";
import { getcuruser } from "@/app/api/user/api";
import type { UserResponseDto } from "@/app/api/user/types";

type CycleStats = {
    currentDay: number;
    cycleLength: number;
    nextPeriod: number;
    fertile: number;
};

type TopBarInfo = {
    title: string;
    subtitle: string; // e.g. "Cycle Day"
    ultsubtitle: string;
};

type DashboardTopBarProps = {
    info: TopBarInfo;
    stats?: CycleStats;
};

function DashboardTopBar({ info, stats }: DashboardTopBarProps) {
    const [me, setMe] = useState<UserResponseDto | null>(null);

    // from /public/images/reproductive/repro1.png
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
        return `${me.firstName} ${me.lastName}`.trim();
    }, [me]);

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#fab0a7] to-[#d04f51] rounded-lg p-4 md:p-6 mb-6 text-white min-h-[170px] md:min-h-[190px]">
            <img
                src={topbannerImageUrl}
                alt="Banner"
                className="
          absolute right-0 top-0 h-full
          w-[180px] md:w-[240px] lg:w-[300px]
          object-cover
          opacity-90
          pointer-events-none
          select-none
        "
            />

            {/* LEFT: Name + Patient ID (keep current location) */}
            <div className="relative z-10">
                <h1 className="text-xl md:text-2xl font-bold mb-1">Hi! {fullname}</h1>
                <div className="text-sm opacity-90">Patient ID: RP-2025-001</div>
            </div>

            {/* CENTER: Cycle + stats (center of banner) */}
            <div
                className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          z-10
          flex flex-col sm:flex-row items-center gap-6
          px-3
        "
            >
                {/* Circle */}
                <div className="flex flex-col items-center">
                    <div
                        className="
              w-20 h-20 md:w-24 md:h-24
              rounded-full
              bg-white/20
              border border-white/30
              ring-1 ring-white/20
              shadow-sm
              flex items-center justify-center
            "
                    >
                        <span className="text-3xl md:text-4xl font-extrabold leading-none">
                            {stats?.currentDay ?? "—"}
                        </span>
                    </div>
                    <div className="mt-2 text-xs md:text-xs text-xs opacity-90 text-center">
                        {info.subtitle}
                    </div>

                    <div className="flex flex-col text-center sm:text-center text-[11px] opacity-95">
                        <div>
                            Next period in{" "}
                            <span className="font-semibold text-white">
                                {stats?.nextPeriod ?? "—"} days
                            </span>
                        </div>
                        {/* <div>
                            Fertile window in{" "}
                            <span className="font-semibold text-white">
                                {stats?.fertile ?? "—"} days
                            </span>
                        </div> */}
                    </div>
                </div>

                {/* Other stats */}

            </div>
        </div >
    );
}

export default DashboardTopBar;