"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Baby,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Loader2,
  Sparkles,
  X,
  History,
  ClipboardList,
} from "lucide-react";
import dailyRecommendationApi from "@/app/api/dailyrecommendation/api";
import type {
  ChecklistItem,
  HistoryItem,
  RecommendationData,
  UserData,
} from "@/app/api/dailyrecommendation/types";

type DailyRecommendationCardProps = {
  token: string;
  userId: number;
  enabled: boolean;
};

const TOTAL_PREGNANCY_WEEKS = 40;

function getChecklistStats(items: ChecklistItem[] = []) {
  const completed = items.filter((item) => item.completed).length;
  const pending = items.length - completed;

  return {
    total: items.length,
    completed,
    pending,
  };
}

function normalizeRecommendationLines(text?: string) {
  if (!text) return [];

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•]\s*/, ""));
}

function formatDateLabel(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-lg border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-1">
          <h3 className="text-md font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

type HorizontalTimelineItemProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
};

function HorizontalTimelineItem({
  label,
  value,
  icon,
}: HorizontalTimelineItemProps) {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 shadow-[0_0_0_6px_rgba(24,24,27,0.95)]">
        {icon}
      </div>

      <div className="mt-3 text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="text-md font-semibold text-white">{value}</div>
    </div>
  );
}

export default function DailyRecommendationCard({
  token,
  userId,
  enabled,
}: DailyRecommendationCardProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [todayRecommendation, setTodayRecommendation] =
    useState<RecommendationData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showTodayModal, setShowTodayModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRecommendationBundle() {
      if (!enabled || !token || !userId) {
        if (active) {
          setUserData(null);
          setTodayRecommendation(null);
          setHistory([]);
          setError("");
        }
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [user, today, historyItems] = await Promise.all([
          dailyRecommendationApi.getUser(token, userId),
          dailyRecommendationApi.getTodayRecommendation(token, userId),
          dailyRecommendationApi.getHistory(token, userId, 10),
        ]);

        if (!active) return;

        setUserData(user);
        setTodayRecommendation(today);
        setHistory(historyItems);
      } catch (err) {
        if (!active) return;

        setUserData(null);
        setTodayRecommendation(null);
        setHistory([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load daily recommendation data."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadRecommendationBundle();

    return () => {
      active = false;
    };
  }, [enabled, token, userId]);

  const pregnancyWeek = Math.max(0, Number(userData?.pregnancy_week || 0));
  const weeksToGo = Math.max(0, TOTAL_PREGNANCY_WEEKS - pregnancyWeek);
  const daysLeft = weeksToGo * 7;

  const todayChecklist = todayRecommendation?.checklist || [];
  const todayStats = getChecklistStats(todayChecklist);
  const recommendationLines = normalizeRecommendationLines(
    todayRecommendation?.recommendation
  );

  const pendingTodayItems = todayChecklist.filter((item) => !item.completed);
  const doneTodayItems = todayChecklist.filter((item) => item.completed);

  const historyWithStats = useMemo(() => {
    return history.map((entry) => ({
      ...entry,
      stats: getChecklistStats(entry.checklist || []),
    }));
  }, [history]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <section className="rounded-lg border border-white/10 bg-zinc-950 p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-md font-semibold text-white">
              <Sparkles className="h-4 w-4 text-zinc-300" />
              Daily Recommendations
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Pregnancy progress and today&apos;s checklist overview.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTodayModal(true)}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              aria-label="Open today's recommendation"
              title="Today's Recommendation"
            >
              <ClipboardList className="h-5 w-5 shrink-0" />
              <div className="flex items-center gap-1.5 text-[11px] leading-none">
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-amber-200">
                  P: {todayStats.pending}
                </span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-200">
                  D: {todayStats.completed}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="rounded-xl border border-white/10 bg-zinc-900 p-2.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              aria-label="Open recommendation history"
              title="Recommendation History"
            >
              <History className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-6 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading recommendation details...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 pl-4 pr-4 pb-2 pt-2">
              <div className="mb-2 text-sm font-medium text-white">
                Pregnancy Progress
              </div>

              <div className="overflow-x-auto">
                <div className="relative min-w-[640px] px-2 pt-2">
                  <div className="pointer-events-none absolute left-0 right-0 top-7 h-px bg-white/10" />

                  <div className="relative flex items-start justify-between gap-6">
                    <HorizontalTimelineItem
                      label="Current week"
                      value={pregnancyWeek || "-"}
                      icon={<Baby className="h-4 w-4" />}
                    />
                    <HorizontalTimelineItem
                      label="Weeks to go"
                      value={weeksToGo}
                      icon={<CalendarClock className="h-4 w-4" />}
                    />
                    <HorizontalTimelineItem
                      label="Days left"
                      value={daysLeft}
                      icon={<Clock3 className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Modal
        open={showTodayModal}
        onClose={() => setShowTodayModal(false)}
        title="Today's Recommendation"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-200">
              Pending: {pendingTodayItems.length}
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-200">
              Done: {doneTodayItems.length}
            </span>
            <span className="text-zinc-500">
              Date: {formatDateLabel(todayRecommendation?.date)}
            </span>
          </div>

          {todayChecklist.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-amber-500/20 bg-zinc-900/60 p-4">
                <h4 className="mb-3 text-sm font-semibold text-amber-200">
                  Pending
                </h4>

                {pendingTodayItems.length > 0 ? (
                  <div className="space-y-2">
                    {pendingTodayItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-md border border-white/10 bg-black/30 px-3 py-2"
                      >
                        <Clock3 className="mt-0.5 h-4 w-4 text-amber-400" />
                        <div className="text-xs text-white">{item.text}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-zinc-500">
                    No pending items.
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-zinc-900/60 p-4">
                <h4 className="mb-3 text-sm font-semibold text-emerald-200">
                  Done
                </h4>

                {doneTodayItems.length > 0 ? (
                  <div className="space-y-2">
                    {doneTodayItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-md border border-white/10 bg-black/30 px-3 py-2"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                        <div className="text-xs text-zinc-300 line-through">
                          {item.text}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500">No completed items.</div>
                )}
              </div>
            </div>
          ) : recommendationLines.length > 0 ? (
            <div className="space-y-2">
              {recommendationLines.map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-zinc-300"
                >
                  {line}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 bg-black/20 px-4 py-4 text-xs text-zinc-500">
              No recommendation generated for today.
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Recommendation History"
      >
        {historyWithStats.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 bg-black/20 px-4 py-4 text-xs text-zinc-500">
            No recommendation history found.
          </div>
        ) : (
          <div className="space-y-3">
            {historyWithStats.map((entry) => (
              <div
                key={entry.date}
                className="rounded-md border border-white/10 bg-black/30 p-3"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-medium text-white">
                      {formatDateLabel(entry.date)}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Completed {entry.stats.completed} of {entry.stats.total}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-200">
                      Done: {entry.stats.completed}
                    </span>
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-amber-200">
                      Pending: {entry.stats.pending}
                    </span>
                  </div>
                </div>

                {entry.checklist && entry.checklist.length > 0 ? (
                  <div className="space-y-2">
                    {entry.checklist.map((item) => (
                      <div
                        key={`${entry.date}-${item.id}`}
                        className="flex items-start gap-2 text-xs"
                      >
                        <span className="mt-0.5">
                          {item.completed ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Clock3 className="h-3 w-3 text-amber-400" />
                          )}
                        </span>
                        <span
                          className={
                            item.completed
                              ? "text-zinc-400 line-through"
                              : "text-zinc-300"
                          }
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500">
                    No checklist details saved for this date.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}