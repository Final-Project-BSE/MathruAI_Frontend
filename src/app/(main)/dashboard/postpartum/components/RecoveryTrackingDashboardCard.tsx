"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Loader2,
  NotebookPen,
  RotateCcw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RECOVERY_DATA } from "@/components/recovery-tracking/recovery-data";
import recoveryTrackingApi from "@/app/api/recovery-tracking/api";
import { getcuruser } from "@/app/api/user/api";
import { getSession } from "@/lib/authentication";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

export default function RecoveryTrackingDashboardCard() {
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [latestDay, setLatestDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translatedError, setTranslatedError] = useState("");

  const { language, t } = useLanguage();

  const currentData = useMemo(() => {
    return RECOVERY_DATA.find((d) => d.day === latestDay) || RECOVERY_DATA[0];
  }, [latestDay]);

  const regularTasks = useMemo(() => {
    return currentData.tasks.filter((task) => task.category !== "warning");
  }, [currentData]);

  const completedRegular = useMemo(() => {
    return regularTasks.filter((task) => completedTaskIds.has(task.id)).length;
  }, [regularTasks, completedTaskIds]);

  const progressPercent =
    regularTasks.length > 0
      ? Math.round((completedRegular / regularTasks.length) * 100)
      : 0;

  useEffect(() => {
    async function loadRecoveryProgress() {
      try {
        setLoading(true);
        setError(null);

        const session = await getSession();
        const token = session?.user?.token;

        if (!token) {
          setError(t.postpartum.recovery.loginRequired);
          return;
        }

        const me = await getcuruser(token);
        const userId = me?.id;

        if (!userId) {
          setError(t.postpartum.recovery.identifyFailed);
          return;
        }

        const records = await recoveryTrackingApi.getAllRecordsForPatient(
          token,
          userId
        );

        const initialTasks = new Set<string>();

        if (Array.isArray(records) && records.length > 0) {
          records.forEach((record) => {
            record.completedTaskIds?.forEach((id: string) =>
              initialTasks.add(id)
            );
          });

          const latestRecord = [...records].sort(
            (a, b) => b.dayNumber - a.dayNumber
          )[0];

          setLatestDay(latestRecord?.dayNumber || 1);
        }

        setCompletedTaskIds(initialTasks);
      } catch (err: unknown) {
        console.error("Failed to load recovery summary:", err);

        setError(
          err instanceof Error
            ? err.message
            : t.postpartum.recovery.failed
        );
      } finally {
        setLoading(false);
      }
    }

    void loadRecoveryProgress();
  }, [t]);

  useEffect(() => {
    let active = true;

    const translateError = async () => {
      if (!error || language === "en") {
        setTranslatedError(error ?? "");
        return;
      }

      const translated = await translateText(error, language);

      if (active) {
        setTranslatedError(translated);
      }
    };

    void translateError();

    return () => {
      active = false;
    };
  }, [error, language]);

  return (
    <Card className="overflow-hidden rounded-2xl border-0 bg-white/95 shadow-md backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base text-black md:text-lg">
            <RotateCcw className="h-5 w-5 text-[#d04f51]" />
            {t.postpartum.recovery.title}
          </CardTitle>

          <Link href="/recovery-tracking">
            <Button
              size="sm"
              className="bg-[#d04f51] text-xs text-white hover:bg-[#d63c3e]"
            >
              {t.dashboard.viewDetails}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-10 text-[#d04f51]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t.postpartum.recovery.loading}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            {translatedError || error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            <div className="rounded-xl bg-pink-50 pb-1 pl-4 pr-4 pt-1">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    {t.postpartum.recovery.currentRecoveryDay}
                  </p>

                  <p className="text-xl font-bold text-[#d04f51]">
                    {t.postpartum.recovery.day} {latestDay}
                  </p>
                </div>

                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#d04f51] transition-all duration-500"
                    style={{ height: `${progressPercent}%` }}
                  />

                  <span className="relative z-10 text-sm font-bold text-[#d04f51]">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#fab0a7] to-[#d04f51] transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="mt-3 text-xs font-medium text-gray-600">
                {t.postpartum.recovery.dailyCompletion}: {completedRegular}{" "}
                {t.postpartum.recovery.of} {regularTasks.length}{" "}
                {t.postpartum.recovery.tasks}
              </p>
            </div>

            <div className="rounded-xl border border-pink-100 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-pink-100 p-2">
                  <NotebookPen className="h-4 w-4 text-[#d04f51]" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    {t.postpartum.recovery.notesTitle}
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    {t.postpartum.recovery.notesDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}