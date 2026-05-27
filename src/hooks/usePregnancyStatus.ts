"use client";

import { useEffect, useMemo, useState } from "react";
import apis from "@/app/api/dailyrecommendation/api"
import type { UserData } from "@/app/api/dailyrecommendation/types";

export type PregnancyStats = {
  pregnancyWeek: number;
  daysLeft: number;
};

export function usePregnancyStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();

        const token = session?.user?.token;
        if (!token) {
          setError("Not authenticated");
          setUserData(null);
          return;
        }

        const me = await apis.me(token);
        const userId = me.user_id ?? me.id;

        if (!userId) {
          setError("User ID not found");
          setUserData(null);
          return;
        }

        const user = await apis.getUser(token, userId);
        setUserData(user);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load pregnancy stats");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const stats: PregnancyStats = useMemo(() => {
    const pregnancyWeek = Math.max(userData?.pregnancy_week ?? 0, 0);
    const daysLeft = Math.max((40 - pregnancyWeek) * 7, 0);

    return {
      pregnancyWeek,
      daysLeft,
    };
  }, [userData]);

  return { loading, error, userData, stats };
}