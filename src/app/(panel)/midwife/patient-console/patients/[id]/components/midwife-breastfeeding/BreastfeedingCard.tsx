"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Heart,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import breastfeedingApi from "@/app/api/breastfeeding/api";
import type {
  BreastfeedingSessionResponseDto,
  BreastfeedingIssueResponseDto,
  BreastfeedingTipResponseDto,
  BreastfeedingTipRequestDto,
  TipCategory,
} from "@/app/api/breastfeeding/types";

type Props = {
  token: string;
  patientId: number;
  midwifeId: number;
};

type ActiveTab = "sessions" | "issues" | "tips";

const SIDE_LABELS: Record<string, string> = {
  LEFT: "⬅️ Left",
  RIGHT: "➡️ Right",
  BOTH: "↔️ Both",
};

const ISSUE_LABELS: Record<string, string> = {
  PAIN: "🔴 Pain",
  LATCH_PROBLEM: "🟠 Latch Problem",
  LOW_SUPPLY: "🟡 Low Supply",
  ENGORGEMENT: "🟣 Engorgement",
  MASTITIS: "⚫ Mastitis",
  OTHER: "🔵 Other",
};

const SEVERITY_COLORS: Record<
  string,
  { text: string; border: string; bg: string }
> = {
  MILD: {
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  MODERATE: {
    text: "text-yellow-300",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
  },
  SEVERE: {
    text: "text-red-300",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
  },
};

const CATEGORY_LABELS: Record<TipCategory, string> = {
  LATCH_TECHNIQUE: "👶 Latch Technique",
  MILK_SUPPLY: "🍼 Milk Supply",
  PAIN_RELIEF: "💊 Pain Relief",
  NUTRITION: "🥗 Nutrition",
  PUMPING: "🔵 Pumping",
  GENERAL: "💡 General",
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as TipCategory[];

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

export default function BreastfeedingCard({
  token,
  patientId,
  midwifeId,
}: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("sessions");

  const [sessions, setSessions] = useState<
    BreastfeedingSessionResponseDto[]
  >([]);
  const [issues, setIssues] = useState<BreastfeedingIssueResponseDto[]>([]);
  const [tips, setTips] = useState<BreastfeedingTipResponseDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
    null
  );

  const [selectedIssue, setSelectedIssue] =
    useState<BreastfeedingIssueResponseDto | null>(null);
  const [isIssuePopupOpen, setIsIssuePopupOpen] = useState(false);
  const [midwifeNote, setMidwifeNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [showTipModal, setShowTipModal] = useState(false);
  const [editingTip, setEditingTip] =
    useState<BreastfeedingTipResponseDto | null>(null);
  const [tipCategory, setTipCategory] = useState<TipCategory>("GENERAL");
  const [tipTitle, setTipTitle] = useState("");
  const [tipContent, setTipContent] = useState("");
  const [tipActive, setTipActive] = useState(true);
  const [savingTip, setSavingTip] = useState(false);
  const [deletingTipId, setDeletingTipId] = useState<string | null>(null);
  const [tipFormError, setTipFormError] = useState("");

  const loadAll = useCallback(async () => {
    if (!token || !patientId || !midwifeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [sessionData, issueData, tipData] = await Promise.all([
        breastfeedingApi.getPatientSessionsForMidwife(
          token,
          midwifeId,
          patientId
        ),
        breastfeedingApi.getPatientIssuesForMidwife(
          token,
          midwifeId,
          patientId
        ),
        breastfeedingApi.getAllActiveTips(token),
      ]);

      setSessions(Array.isArray(sessionData) ? sessionData : []);
      setIssues(Array.isArray(issueData) ? issueData : []);
      setTips(Array.isArray(tipData) ? tipData : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load breastfeeding data."
      );
    } finally {
      setLoading(false);
    }
  }, [token, patientId, midwifeId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  function openIssuePopup(issue: BreastfeedingIssueResponseDto) {
    setSelectedIssue(issue);
    setMidwifeNote(issue.midwifeNotes || "");
    setIsIssuePopupOpen(true);
  }

  function closeIssuePopup() {
    setIsIssuePopupOpen(false);
    setSelectedIssue(null);
    setMidwifeNote("");
  }

  async function handleSaveMidwifeNote() {
    if (!selectedIssue || !token) return;

    try {
      setSavingNote(true);

      await breastfeedingApi.updatePatientIssueForMidwife(
        token,
        midwifeId,
        patientId,
        selectedIssue.id,
        {
          issueType: selectedIssue.issueType,
          description: selectedIssue.description,
          severity: selectedIssue.severity,
          reportedAt: selectedIssue.reportedAt,
          resolved: selectedIssue.resolved,
          midwifeNotes: midwifeNote,
        }
      );

      closeIssuePopup();
      await loadAll();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save midwife note."
      );
    } finally {
      setSavingNote(false);
    }
  }

  function openAddTipModal() {
    setEditingTip(null);
    setTipCategory("GENERAL");
    setTipTitle("");
    setTipContent("");
    setTipActive(true);
    setTipFormError("");
    setShowTipModal(true);
  }

  function openEditTipModal(tip: BreastfeedingTipResponseDto) {
    setEditingTip(tip);
    setTipCategory(tip.category);
    setTipTitle(tip.title);
    setTipContent(tip.content);
    setTipActive(tip.active);
    setTipFormError("");
    setShowTipModal(true);
  }

  function closeTipModal() {
    setShowTipModal(false);
    setEditingTip(null);
    setTipFormError("");
  }

  async function handleSaveTip() {
    if (!token) return;

    if (!tipTitle.trim()) {
      setTipFormError("Title is required.");
      return;
    }

    if (!tipContent.trim()) {
      setTipFormError("Content is required.");
      return;
    }

    try {
      setSavingTip(true);
      setTipFormError("");

      const payload: BreastfeedingTipRequestDto = {
        category: tipCategory,
        title: tipTitle,
        content: tipContent,
        active: tipActive,
      };

      if (editingTip) {
        await breastfeedingApi.updateTip(token, editingTip.id, payload);
      } else {
        await breastfeedingApi.createTip(token, payload);
      }

      closeTipModal();
      await loadAll();
    } catch (err) {
      setTipFormError(
        err instanceof Error ? err.message : "Failed to save tip."
      );
    } finally {
      setSavingTip(false);
    }
  }

  async function handleDeleteTip(id: string) {
    if (!token) return;

    try {
      setDeletingTipId(id);
      await breastfeedingApi.deleteTip(token, id);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tip.");
    } finally {
      setDeletingTipId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-[#d04f51]" />
            <h2 className="text-md font-semibold text-white">
              Breastfeeding Support
            </h2>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Patient&apos;s breastfeeding sessions, reported issues and expert
            tips.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-white/10 bg-black/20">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : (
        <>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              {
                label: "Total Sessions",
                value: sessions.length,
                color: "text-[#d04f51]",
              },
              {
                label: "Unresolved Issues",
                value: issues.filter((issue) => !issue.resolved).length,
                color:
                  issues.filter((issue) => !issue.resolved).length > 0
                    ? "text-yellow-300"
                    : "text-emerald-300",
              },
              {
                label: "Active Tips",
                value: tips.filter((tip) => tip.active).length,
                color: "text-blue-300",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-black/30 p-3 text-center"
              >
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mb-5 flex gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
            {(["sessions", "issues", "tips"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  "flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-200",
                  activeTab === tab
                    ? "bg-[#d04f51] text-white"
                    : "text-zinc-400 hover:text-white",
                ].join(" ")}
              >
                {tab === "sessions"
                  ? "🤱 Sessions"
                  : tab === "issues"
                    ? "⚠️ Issues"
                    : "💡 Tips"}
              </button>
            ))}
          </div>

          {activeTab === "sessions" ? (
            <div>
              {sessions.length === 0 ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-white/10 bg-black/20 text-center">
                  <Heart className="mb-2 h-8 w-8 text-zinc-600" />
                  <p className="text-sm text-zinc-500">
                    No feeding sessions logged yet
                  </p>
                </div>
              ) : (
                <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
                  {sessions.map((session) => {
                    const isExpanded = expandedSessionId === session.id;
                    const feedDate = new Date(session.feedingTime);

                    return (
                      <div
                        key={session.id}
                        className="rounded-xl border border-white/10 bg-black/30 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="rounded-full border border-white/10 bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
                              {SIDE_LABELS[session.side] || session.side}
                            </span>

                            <div>
                              <p className="text-sm font-semibold text-white">
                                {feedDate.toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {feedDate.toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="rounded-full border border-white/10 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                              {session.durationMinutes} min
                            </span>

                            {session.milkAmountMl > 0 ? (
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                                {session.milkAmountMl} ml
                              </span>
                            ) : null}

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedSessionId((prev) =>
                                  prev === session.id ? null : session.id
                                )
                              }
                              className="rounded-lg border border-white/10 p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {isExpanded ? (
                          <div className="mt-3 rounded-lg border border-white/10 bg-black/40 p-3">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                              Notes
                            </p>
                            <p className="text-sm leading-relaxed text-zinc-300">
                              {session.notes || "No notes added."}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {activeTab === "issues" ? (
            <div>
              {issues.length === 0 ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-white/10 bg-black/20 text-center">
                  <AlertCircle className="mb-2 h-8 w-8 text-zinc-600" />
                  <p className="text-sm text-zinc-500">No issues reported yet</p>
                </div>
              ) : (
                <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
                  {issues.map((issue) => {
                    const severityStyle =
                      SEVERITY_COLORS[issue.severity] ||
                      SEVERITY_COLORS.MILD;

                    return (
                      <div
                        key={issue.id}
                        className={[
                          "rounded-xl border p-4 transition",
                          issue.resolved
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-white/10 bg-black/30",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1.5">
                            <p className="text-sm font-semibold text-white">
                              {ISSUE_LABELS[issue.issueType] ||
                                issue.issueType}
                            </p>
                            <span
                              className={`w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold ${severityStyle.border} ${severityStyle.bg} ${severityStyle.text}`}
                            >
                              {issue.severity}
                            </span>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {issue.resolved ? (
                              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                                <CheckCircle2 className="h-3 w-3" />
                                Resolved
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-300">
                                <AlertCircle className="h-3 w-3" />
                                Unresolved
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => openIssuePopup(issue)}
                              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                            >
                              Add Note
                            </button>
                          </div>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                          {issue.description}
                        </p>

                        {issue.midwifeNotes ? (
                          <div className="mt-3 rounded-lg border border-white/10 bg-black/40 p-3">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                              Midwife Note
                            </p>
                            <p className="text-sm leading-relaxed text-zinc-300">
                              {issue.midwifeNotes}
                            </p>
                          </div>
                        ) : null}

                        <p className="mt-2 text-xs text-zinc-600">
                          Reported: {formatDateTime(issue.reportedAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {activeTab === "tips" ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Manage breastfeeding tips for all patients
                </p>

                <button
                  type="button"
                  onClick={openAddTipModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d04f51] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#d43d40]"
                >
                  <Plus className="h-4 w-4" />
                  Add Tip
                </button>
              </div>

              {tips.length === 0 ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-white/10 bg-black/20 text-center">
                  <Lightbulb className="mb-2 h-8 w-8 text-zinc-600" />
                  <p className="text-sm text-zinc-500">No tips added yet</p>
                </div>
              ) : (
                <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
                  {tips.map((tip) => (
                    <div
                      key={tip.id}
                      className="rounded-xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1.5">
                          <span className="w-fit rounded-full border border-white/10 bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300">
                            {CATEGORY_LABELS[tip.category] || tip.category}
                          </span>
                          <p className="text-sm font-semibold text-white">
                            {tip.title}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          {!tip.active ? (
                            <span className="rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
                              Inactive
                            </span>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => openEditTipModal(tip)}
                            className="rounded-lg border border-white/10 p-1.5 text-zinc-300 hover:bg-white/5"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTip(tip.id)}
                            disabled={deletingTipId === tip.id}
                            className="rounded-lg border border-red-500/20 p-1.5 text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                          >
                            {deletingTipId === tip.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {tip.content}
                      </p>
                      <p className="mt-2 text-xs text-zinc-600">
                        Added: {formatDateTime(tip.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </>
      )}

      {isIssuePopupOpen && selectedIssue ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Add Midwife Note
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {ISSUE_LABELS[selectedIssue.issueType]} —{" "}
                  {selectedIssue.severity}
                </p>
              </div>

              <button
                type="button"
                onClick={closeIssuePopup}
                className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 rounded-xl border border-white/10 bg-black/40 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Patient&apos;s Description
              </p>
              <p className="text-sm leading-relaxed text-zinc-300">
                {selectedIssue.description}
              </p>
            </div>

            <div className="mb-4">
              <p className="mb-1.5 text-xs font-medium text-zinc-400">
                Your Note
              </p>
              <textarea
                rows={4}
                placeholder="Add your clinical notes or advice here..."
                value={midwifeNote}
                onChange={(event) => setMidwifeNote(event.target.value)}
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#d04f51]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeIssuePopup}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveMidwifeNote}
                disabled={savingNote}
                className="inline-flex items-center gap-2 rounded-xl bg-[#d04f51] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#d43d40] disabled:opacity-60"
              >
                {savingNote ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Note"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showTipModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {editingTip ? "Edit Tip" : "Add New Tip"}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {editingTip
                    ? "Update the breastfeeding tip details"
                    : "Add a new breastfeeding tip for patients"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeTipModal}
                className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {tipFormError ? (
              <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {tipFormError}
              </div>
            ) : null}

            <div className="mb-3">
              <p className="mb-1.5 text-xs font-medium text-zinc-400">
                Category
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setTipCategory(category)}
                    className={[
                      "rounded-lg border px-3 py-2 text-left text-xs font-semibold transition",
                      tipCategory === category
                        ? "border-[#d04f51] bg-[#d04f51] text-white"
                        : "border-white/10 bg-black/30 text-zinc-300 hover:bg-white/5",
                    ].join(" ")}
                  >
                    {CATEGORY_LABELS[category]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-1.5 text-xs font-medium text-zinc-400">
                Title <span className="text-[#d04f51]">*</span>
              </p>
              <input
                type="text"
                placeholder="e.g. How to improve latch technique"
                value={tipTitle}
                onChange={(event) => setTipTitle(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#d04f51]"
              />
            </div>

            <div className="mb-3">
              <p className="mb-1.5 text-xs font-medium text-zinc-400">
                Content <span className="text-[#d04f51]">*</span>
              </p>
              <textarea
                rows={4}
                placeholder="Write the tip content here..."
                value={tipContent}
                onChange={(event) => setTipContent(event.target.value)}
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#d04f51]"
              />
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Active</p>
                <p className="text-xs text-zinc-500">
                  Show this tip to patients
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTipActive((prev) => !prev)}
                className={[
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                  tipActive ? "bg-[#d04f51]" : "bg-zinc-700",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                    tipActive ? "translate-x-6" : "translate-x-1",
                  ].join(" ")}
                />
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeTipModal}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveTip}
                disabled={savingTip}
                className="inline-flex items-center gap-2 rounded-xl bg-[#d04f51] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#d43d40] disabled:opacity-60"
              >
                {savingTip ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : editingTip ? (
                  "Update Tip"
                ) : (
                  "Add Tip"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}