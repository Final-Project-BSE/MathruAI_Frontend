"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RefreshCw,
  X,
  FileText,
} from "lucide-react";
import recoveryTrackingApi from "@/app/api/recovery-tracking/api";
import type { RecoveryRecordResponseDto } from "@/app/api/recovery-tracking/types";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  RECOVERY_DATA,
  type TaskCategory,
} from "@/components/recovery-tracking/recovery-data";

type RecoveryTrackingCardProps = {
  token: string;
  patientId: number;
};

const CATEGORIES: TaskCategory[] = [
  "physical",
  "nutrition",
  "baby",
  "mental",
  "medical",
  "warning",
];

const DAYS_PER_PAGE = 5;

function getRecordMap(records: RecoveryRecordResponseDto[]) {
  return records.reduce<Record<number, RecoveryRecordResponseDto>>(
    (acc, record) => {
      acc[record.dayNumber] = record;
      return acc;
    },
    {}
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecoveryTrackingCard({
  token,
  patientId,
}: RecoveryTrackingCardProps) {
  const [records, setRecords] = useState<RecoveryRecordResponseDto[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadRecoveryRecords(options?: { silent?: boolean }) {
    if (!token || !patientId) return;

    try {
      setError("");

      if (options?.silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await recoveryTrackingApi.getAllRecordsForPatient(
        token,
        patientId
      );

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load recovery tracking data."
      );
      setRecords([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadRecoveryRecords();
  }, [token, patientId]);

  const recordByDay = useMemo(() => getRecordMap(records), [records]);

  const dayRows = useMemo(() => {
    return RECOVERY_DATA.map((dayData) => {
      const record = recordByDay[dayData.day];
      const completedIds = new Set(record?.completedTaskIds || []);

      const regularTasks = dayData.tasks.filter(
        (task) => task.category !== "warning"
      );

      const completedRegularCount = regularTasks.filter((task) =>
        completedIds.has(task.id)
      ).length;

      const progress =
        regularTasks.length > 0
          ? Math.round((completedRegularCount / regularTasks.length) * 100)
          : 0;

      return {
        day: dayData.day,
        record,
        regularTasks,
        completedRegularCount,
        progress,
      };
    });
  }, [recordByDay]);

  const totalPages = Math.ceil(dayRows.length / DAYS_PER_PAGE);

  const paginatedDayRows = useMemo(() => {
    const startIndex = (currentPage - 1) * DAYS_PER_PAGE;
    return dayRows.slice(startIndex, startIndex + DAYS_PER_PAGE);
  }, [dayRows, currentPage]);

  const selectedDayData = useMemo(() => {
    return (
      RECOVERY_DATA.find((item) => item.day === selectedDay) || RECOVERY_DATA[0]
    );
  }, [selectedDay]);

  const selectedRecord = recordByDay[selectedDay];

  const selectedCompletedIds = useMemo(() => {
    return new Set(selectedRecord?.completedTaskIds || []);
  }, [selectedRecord]);

  const tasksByCategory = useMemo(() => {
    const grouped = {} as Record<TaskCategory, typeof selectedDayData.tasks>;

    CATEGORIES.forEach((category) => {
      grouped[category] = selectedDayData.tasks.filter(
        (task) => task.category === category
      );
    });

    return grouped;
  }, [selectedDayData]);

  const selectedTasks = selectedCategory
    ? tasksByCategory[selectedCategory]
    : [];

  function openDayPopup(day: number) {
    setSelectedDay(day);
    setSelectedCategory(null);
    setShowNotes(false);
    setIsPopupOpen(true);
  }

  function closePopup() {
    setIsPopupOpen(false);
    setSelectedCategory(null);
    setShowNotes(false);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-[#d04f51]" />
            <h2 className="text-md font-semibold text-white">
              Recovery Tracking
            </h2>
          </div>

          <p className="mt-1 text-xs text-zinc-500">
            Date-wise recovery progress submitted by this patient.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-white/10 bg-black/20">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <div className="grid grid-cols-4 bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              <span>Date</span>
              <span>Progress</span>
              <span>Last Updated</span>
              <span className="text-right">Action</span>
            </div>

            <div className="divide-y divide-white/10">
              {paginatedDayRows.map((row) => (
                <div
                  key={row.day}
                  className="grid grid-cols-4 items-center gap-3 bg-black/20 px-4 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium text-white">
                      Postpartum Day {row.day}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {row.record ? "Record available" : "No record yet"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-zinc-400">
                      {row.completedRegularCount} of {row.regularTasks.length}{" "}
                      tasks · {row.progress}%
                    </p>

                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-[#d04f51]"
                        style={{ width: `${row.progress}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500">
                    {formatDateTime(row.record?.updatedAt)}
                  </p>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => openDayPopup(row.day)}
                      className="rounded-lg bg-[#d04f51] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#d43d40]"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 bg-zinc-900 px-4 py-2">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <p className="text-xs text-zinc-500">
                Page {currentPage} of {totalPages}
              </p>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          {isPopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-2xl">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-md font-semibold text-white">
                      Postpartum Day {selectedDay}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      Last updated: {formatDateTime(selectedRecord?.updatedAt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closePopup}
                    className="rounded-lg border border-white/10 bg-zinc-900 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                    aria-label="Close popup"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {!selectedCategory && !showNotes && (
                  <>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold text-white">
                        Checklist Types
                      </h4>

                      <button
                        type="button"
                        onClick={() => setShowNotes(true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                      >
                        <FileText className="h-4 w-4" />
                        See Note
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {CATEGORIES.map((category) => {
                        const tasks = tasksByCategory[category];
                        if (!tasks.length) return null;

                        const isWarning = category === "warning";
                        const completedCount = tasks.filter((task) =>
                          selectedCompletedIds.has(task.id)
                        ).length;

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-xl border p-4 text-left transition hover:scale-[1.01] ${
                              isWarning
                                ? "border-red-500/20 bg-red-500/10"
                                : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <h5
                                className={`text-sm font-semibold ${
                                  isWarning ? "text-red-300" : "text-white"
                                }`}
                              >
                                {CATEGORY_LABELS[category]}
                              </h5>

                              <span
                                className="text-xs font-bold"
                                style={{
                                  color: isWarning
                                    ? "#fca5a5"
                                    : CATEGORY_COLORS[category],
                                }}
                              >
                                {completedCount}/{tasks.length}
                              </span>
                            </div>

                            <p className="mt-2 text-xs text-zinc-500">
                              Click to view related checklist.
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {selectedCategory && (
                  <>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {CATEGORY_LABELS[selectedCategory]}
                        </h4>
                        <p className="mt-1 text-xs text-zinc-500">
                          Related checklist for selected date.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                      >
                        Back
                      </button>
                    </div>

                    <div className="space-y-2">
                      {selectedTasks.map((task) => {
                        const completed = selectedCompletedIds.has(task.id);
                        const isWarning = selectedCategory === "warning";

                        return (
                          <div
                            key={task.id}
                            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
                              completed
                                ? isWarning
                                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                                  : "border-emerald-500/20 bg-emerald-500/10 text-zinc-200"
                                : "border-white/10 bg-black/20 text-zinc-500"
                            }`}
                          >
                            {completed ? (
                              isWarning ? (
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                              ) : (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                              )
                            ) : (
                              <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-zinc-600" />
                            )}

                            <span>{task.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {showNotes && (
                  <>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold text-white">
                        Daily Notes & Symptoms
                      </h4>

                      <button
                        type="button"
                        onClick={() => setShowNotes(false)}
                        className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                      >
                        Back
                      </button>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                        {selectedRecord?.dailyNotes?.trim() ||
                          "No notes added for this day."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}