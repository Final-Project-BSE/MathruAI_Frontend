"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
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
    subtitle: string;
    ultsubtitle: string;
};

type DashboardTopBarProps = {
    info: TopBarInfo;
    stats?: CycleStats;
};

function DashboardTopBar({ info, stats }: DashboardTopBarProps) {

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [me, setMe] = useState<UserResponseDto | null>(null);

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
        <div className="bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg p-4 md:p-6 mb-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold mb-2">{info.title}</h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold">{stats?.currentDay}</div>
                            <div className="text-sm">{info.subtitle}</div>
                            <div className="text-xs opacity-90">{info.ultsubtitle}</div>
                        </div>
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <div className="font-semibold">{fullname}</div>
                    <div className="text-sm opacity-90">Patient ID: RP-2025-001</div>
                    {/* <Avatar className="w-10 h-10 mt-2">
                        <AvatarFallback className="bg-pink-500 text-white">SJ</AvatarFallback>
                    </Avatar>
                    <div>
                        <Button className="bg-pink-500 text-white" onClick={() => setIsPopupOpen(true)}>Update Data</Button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default DashboardTopBar