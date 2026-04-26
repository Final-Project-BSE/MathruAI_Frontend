"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Loader2,
  Pencil,
  Plus,
  Syringe,
  Trash2,
  X,
} from "lucide-react";
import { vaccinationApi } from "@/app/api/vaccination/api";
import type {
  VaccinationCardRequestDto,
  VaccinationCardResponseDto,
  VaccinationStatus,
} from "@/app/api/vaccination/types";

type Props = {
  token: string;
  midwifeId: number;
  patientId: number;
};

type VaccinationTab = "COMPLETED" | "PENDING" | "MISSED";

function useAutoDismiss(value: string, delay = 5000) {
  const [visibleValue, setVisibleValue] = useState(value);

  useEffect(() => {
    if (!value) {
      setVisibleValue("");
      return;
    }

    setVisibleValue(value);

    const timer = setTimeout(() => {
      setVisibleValue("");
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return visibleValue;
}

function statusClass(status: VaccinationStatus) {
  if (status === "COMPLETED")
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (status === "MISSED")
    return "border-red-500/30 bg-red-500/10 text-red-300";
  return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
}

function toPayload(card: VaccinationCardResponseDto): VaccinationCardRequestDto {
  return {
    vaccineName: card.vaccineName,
    vaccineType: card.vaccineType || undefined,
    dose: card.dose || undefined,
    dueDate: card.dueDate,
    status: card.status,
    midwifeNote: card.midwifeNote || undefined,
    completedDate: card.completedDate || undefined,
    vaccinationInjectionDate: card.vaccinationInjectionDate || undefined,
    location: card.location || undefined,
  };
}

export default function PatientVaccinationCard({
  token,
  midwifeId,
  patientId,
}: Props) {
  const [patientCards, setPatientCards] = useState<
    VaccinationCardResponseDto[]
  >([]);
  const [globalCards, setGlobalCards] = useState<
    VaccinationCardResponseDto[]
  >([]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeTab, setActiveTab] = useState<VaccinationTab>("PENDING");

  const [editingCard, setEditingCard] =
    useState<VaccinationCardResponseDto | null>(null);
  const [form, setForm] = useState<VaccinationCardRequestDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const visibleError = useAutoDismiss(error);
  const visibleSuccess = useAutoDismiss(success);

  const completedCards = useMemo(
    () => patientCards.filter((card) => card.status === "COMPLETED"),
    [patientCards]
  );

  const pendingCards = useMemo(
    () => patientCards.filter((card) => card.status === "PENDING"),
    [patientCards]
  );

  const missedCards = useMemo(
    () => patientCards.filter((card) => card.status === "MISSED"),
    [patientCards]
  );

  const activeTabCards = useMemo(() => {
    if (activeTab === "COMPLETED") return completedCards;
    if (activeTab === "MISSED") return missedCards;
    return pendingCards;
  }, [activeTab, completedCards, pendingCards, missedCards]);

  const assignableCards = useMemo(() => {
    return globalCards.filter((globalCard) => {
      return !patientCards.some(
        (patientCard) =>
          patientCard.vaccineName === globalCard.vaccineName &&
          (patientCard.vaccineType || "") ===
            (globalCard.vaccineType || "") &&
          (patientCard.dose || "") === (globalCard.dose || "") &&
          patientCard.dueDate === globalCard.dueDate
      );
    });
  }, [globalCards, patientCards]);

  async function loadCards() {
    const [patientData, globalData] = await Promise.all([
      vaccinationApi.getPatientCards(token, midwifeId, patientId),
      vaccinationApi.getGlobalCards(token, midwifeId),
    ]);

    setPatientCards(patientData);
    setGlobalCards(globalData);
  }

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);
        setError("");
        await loadCards();
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load vaccinations."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void run();

    return () => {
      active = false;
    };
  }, [token, midwifeId, patientId]);

  async function assignCard(cardId: number) {
    try {
      setAssigningId(cardId);
      setError("");
      setSuccess("");

      await vaccinationApi.assignGlobalCardToPatient(
        token,
        midwifeId,
        patientId,
        cardId
      );

      setSuccess("Vaccination assigned to patient.");
      await loadCards();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to assign vaccination card."
      );
    } finally {
      setAssigningId(null);
    }
  }

  function startEdit(card: VaccinationCardResponseDto) {
    setEditingCard(card);
    setForm(toPayload(card));
    setError("");
    setSuccess("");
  }

  function closeEditModal() {
    setEditingCard(null);
    setForm(null);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();

    if (!editingCard || !form) return;

    if (form.status === "COMPLETED" && !form.completedDate) {
      setError("Completed date is required for completed vaccination.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await vaccinationApi.updateCard(token, midwifeId, editingCard.id, {
        ...toPayload(editingCard),
        status: form.status,
        completedDate:
          form.status === "COMPLETED" ? form.completedDate : undefined,
      });

      setSuccess("Patient vaccination status updated.");
      closeEditModal();
      await loadCards();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update vaccination status."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCard(cardId: number) {
    if (!confirm("Remove this vaccination card from this patient?")) return;

    try {
      setDeletingId(cardId);
      setError("");
      setSuccess("");

      await vaccinationApi.deleteCard(token, midwifeId, cardId);

      setSuccess("Patient vaccination removed.");
      await loadCards();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove vaccination."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const tabItems: { label: string; value: VaccinationTab; count: number }[] = [
    { label: "Completed", value: "COMPLETED", count: completedCards.length },
    { label: "Pending", value: "PENDING", count: pendingCards.length },
    { label: "Missed", value: "MISSED", count: missedCards.length },
  ];

  return (
    <section className="relative rounded-[22px] border border-white/10 bg-black p-5 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-md font-bold text-white">
            <Syringe className="h-5 w-5" /> Vaccination
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            View patient vaccination progress and assign reusable vaccination
            cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowViewModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/5"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          <button
            type="button"
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Assign
          </button>
        </div>
      </div>

      {visibleError ? (
        <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
          {visibleError}
        </div>
      ) : null}

      {visibleSuccess ? (
        <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          {visibleSuccess}
        </div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="text-xs text-emerald-300">Completed</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {completedCards.length}
            </p>
          </div>

          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
            <p className="text-xs text-yellow-300">Pending</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {pendingCards.length}
            </p>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-xs text-red-300">Missed</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {missedCards.length}
            </p>
          </div>
        </div>
      )}

      {showViewModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Patient vaccinations
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  View completed, pending, and missed vaccinations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {tabItems.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                    activeTab === tab.value
                      ? "border-white bg-white text-black"
                      : "border-white/10 text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {activeTabCards.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-black px-4 py-6 text-sm text-zinc-500">
                No {activeTab.toLowerCase()} vaccinations found.
              </p>
            ) : (
              <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                {activeTabCards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-xl border border-white/10 bg-black p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {card.vaccineName}
                        </h4>
                        <p className="mt-1 text-xs text-zinc-500">
                          {card.vaccineType || "No type"} • Dose:{" "}
                          {card.dose || "-"}
                        </p>
                        <p className="mt-2 text-xs text-zinc-400">
                          Due: {card.dueDate} • Injection:{" "}
                          {card.vaccinationInjectionDate || "-"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          Completed: {card.completedDate || "-"} • Location:{" "}
                          {card.location || "-"}
                        </p>

                        {card.midwifeNote ? (
                          <p className="mt-2 text-xs text-zinc-500">
                            Note: {card.midwifeNote}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] ${statusClass(
                            card.status
                          )}`}
                        >
                          {card.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => startEdit(card)}
                          className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/5"
                          title="Update status"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === card.id}
                          onClick={() => deleteCard(card.id)}
                          className="rounded-lg border border-red-500/20 p-2 text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                        >
                          {deletingId === card.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {showAssignModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Assign vaccination
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Select a reusable vaccination card and assign it to this
                  patient.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {assignableCards.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-black px-4 py-6 text-sm text-zinc-500">
                No unassigned vaccination cards available. Create reusable cards
                from the vaccination page first.
              </p>
            ) : (
              <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                {assignableCards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-xl border border-white/10 bg-black p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {card.vaccineName}
                        </h4>
                        <p className="mt-1 text-xs text-zinc-500">
                          {card.vaccineType || "No type"} • Dose:{" "}
                          {card.dose || "-"}
                        </p>
                        <p className="mt-2 text-xs text-zinc-400">
                          Due: {card.dueDate} • Location:{" "}
                          {card.location || "-"}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={assigningId === card.id}
                        onClick={() => assignCard(card.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-60"
                      >
                        {assigningId === card.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {editingCard && form ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <form
            onSubmit={saveEdit}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Update vaccination status
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Only status can be changed here. Other vaccination card data
                  will stay unchanged.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 rounded-xl border border-white/10 bg-black p-4">
              <h4 className="text-sm font-semibold text-white">
                {editingCard.vaccineName}
              </h4>
              <p className="mt-1 text-xs text-zinc-500">
                {editingCard.vaccineType || "No type"} • Dose:{" "}
                {editingCard.dose || "-"}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                Due: {editingCard.dueDate} • Location:{" "}
                {editingCard.location || "-"}
              </p>
            </div>

            <div className="grid gap-4">
              <label className="space-y-1 text-sm">
                <span className="text-zinc-300">Status</span>
                <select
                  className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
                  value={form.status}
                  onChange={(e) => {
                    const nextStatus = e.target.value as VaccinationStatus;

                    setForm({
                      ...form,
                      status: nextStatus,
                      completedDate:
                        nextStatus === "COMPLETED"
                          ? form.completedDate || ""
                          : undefined,
                    });
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="MISSED">Missed</option>
                </select>
              </label>

              {form.status === "COMPLETED" ? (
                <label className="space-y-1 text-sm">
                  <span className="text-zinc-300">Completed date *</span>
                  <input
                    type="date"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
                    value={form.completedDate || ""}
                    onChange={(e) =>
                      setForm({ ...form, completedDate: e.target.value })
                    }
                  />
                </label>
              ) : null}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}