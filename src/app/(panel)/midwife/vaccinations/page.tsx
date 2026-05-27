"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  Syringe,
  Trash2,
  Pencil,
  CalendarDays,
  X,
} from "lucide-react";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";
import { vaccinationApi } from "@/app/api/vaccination/api";
import type {
  VaccinationCardRequestDto,
  VaccinationCardResponseDto,
  VaccinationStatus,
  VaccinationSummaryDto,
  VaccineEligibilityDto,
} from "@/app/api/vaccination/types";

type FormState = VaccinationCardRequestDto;

const emptyForm: FormState = {
  vaccineName: "",
  vaccineType: "",
  dose: "",
  dueDate: "",
  status: "PENDING",
  midwifeNote: "",
  completedDate: "",
  vaccinationInjectionDate: "",
  location: "",
};

function statusClass(status: VaccinationStatus) {
  if (status === "COMPLETED")
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (status === "MISSED")
    return "border-red-500/30 bg-red-500/10 text-red-300";
  return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-xl">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function VaccinationManagementPage() {
  const [token, setToken] = useState("");
  const [midwifeId, setMidwifeId] = useState<number | null>(null);
  const [cards, setCards] = useState<VaccinationCardResponseDto[]>([]);
  const [upcoming, setUpcoming] = useState<VaccinationCardResponseDto[]>([]);
  const [eligibility, setEligibility] = useState<VaccineEligibilityDto[]>([]);
  const [summary, setSummary] = useState<VaccinationSummaryDto | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [cards]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        setError("");

        const session = await getSession();
        const jwt = session?.user?.token || "";

        if (!jwt) throw new Error("You are not authenticated.");

        const me = await getcuruser(jwt);

        if (!me.roles?.includes("MIDWIFE" as any)) {
          throw new Error("Only midwives can manage vaccinations.");
        }

        if (!active) return;

        setToken(jwt);
        setMidwifeId(me.id);

        const [allCards, summaryData, upcomingData, eligibilityData] =
          await Promise.all([
            vaccinationApi.getMidwifeCards(jwt, me.id),
            vaccinationApi.getSummary(jwt, me.id),
            vaccinationApi.getUpcoming(jwt, me.id, 30),
            vaccinationApi.getEligibility(jwt, me.id),
          ]);

        if (!active) return;

        setCards(allCards);
        setSummary(summaryData);
        setUpcoming(upcomingData);
        setEligibility(eligibilityData);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load vaccination data."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  async function reload() {
    if (!token || !midwifeId) return;

    const [allCards, summaryData, upcomingData, eligibilityData] =
      await Promise.all([
        vaccinationApi.getMidwifeCards(token, midwifeId),
        vaccinationApi.getSummary(token, midwifeId),
        vaccinationApi.getUpcoming(token, midwifeId, 30),
        vaccinationApi.getEligibility(token, midwifeId),
      ]);

    setCards(allCards);
    setSummary(summaryData);
    setUpcoming(upcomingData);
    setEligibility(eligibilityData);
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(false);
  }

  function buildPayload(): VaccinationCardRequestDto {
    if (!form.vaccineName.trim()) {
      throw new Error("Vaccine name is required.");
    }

    if (!form.dueDate) {
      throw new Error("Due date is required.");
    }

    if (form.status === "COMPLETED" && !form.completedDate) {
      throw new Error("Completed date is required for completed vaccines.");
    }

    return {
      vaccineName: form.vaccineName.trim(),
      vaccineType: form.vaccineType?.trim() || undefined,
      dose: form.dose?.trim() || undefined,
      dueDate: form.dueDate,
      status: form.status,
      midwifeNote: form.midwifeNote?.trim() || undefined,
      completedDate: form.completedDate || undefined,
      vaccinationInjectionDate: form.vaccinationInjectionDate || undefined,
      location: form.location?.trim() || undefined,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token || !midwifeId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = buildPayload();

      if (editingId) {
        await vaccinationApi.updateCard(token, midwifeId, editingId, payload);
        setSuccess("Vaccination card updated.");
      } else {
        await vaccinationApi.createGlobalCard(token, midwifeId, payload);
        setSuccess("Vaccination card created.");
      }

      closeForm();
      await reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save vaccination card."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(card: VaccinationCardResponseDto) {
    setEditingId(card.id);
    setError("");
    setSuccess("");

    setForm({
      vaccineName: card.vaccineName || "",
      vaccineType: card.vaccineType || "",
      dose: card.dose || "",
      dueDate: card.dueDate || "",
      status: card.status,
      midwifeNote: card.midwifeNote || "",
      completedDate: card.completedDate || "",
      vaccinationInjectionDate: card.vaccinationInjectionDate || "",
      location: card.location || "",
    });

    setIsFormOpen(true);
  }

  async function deleteCard(cardId: number) {
    if (!token || !midwifeId) return;
    if (!confirm("Delete this vaccination card?")) return;

    try {
      setError("");

      await vaccinationApi.deleteCard(token, midwifeId, cardId);

      setSuccess("Vaccination card deleted.");

      await reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete vaccination card."
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Midwife module
            </p>

            <h1 className="mt-2 flex items-center gap-3 text-2xl font-bold">
              <Syringe className="h-6 w-6" />
              Vaccination Management
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Create reusable vaccine cards and track patient vaccination status.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Add New Vaccination Card
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total cards" value={summary?.totalCards || 0} />
          <StatCard label="Upcoming" value={summary?.upcomingVaccinations || 0} />
          <StatCard label="Today" value={summary?.todayVaccinations || 0} />
          <StatCard label="Pending" value={summary?.pendingPatients || 0} />
          <StatCard label="Completed" value={summary?.completedPatients || 0} />
          <StatCard label="Missed" value={summary?.missedPatients || 0} />
        </div>

        {isFormOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Plus className="h-4 w-4" />
                  {editingId
                    ? "Update vaccination card"
                    : "Add new vaccination card"}
                </h2>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
              >
                <label className="space-y-1 text-sm">
                  <span className="text-zinc-300">Vaccine name *</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                    value={form.vaccineName}
                    onChange={(e) =>
                      setForm({ ...form, vaccineName: e.target.value })
                    }
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-zinc-300">Vaccine type</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                    value={form.vaccineType}
                    onChange={(e) =>
                      setForm({ ...form, vaccineType: e.target.value })
                    }
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-zinc-300">Dose</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                    value={form.dose}
                    onChange={(e) =>
                      setForm({ ...form, dose: e.target.value })
                    }
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-zinc-300">Due date *</span>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-zinc-300">Vaccination status</span>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as VaccinationStatus,
                      })
                    }
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="MISSED">Missed</option>
                  </select>
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-zinc-300">Completed date</span>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                    value={form.completedDate}
                    onChange={(e) =>
                      setForm({ ...form, completedDate: e.target.value })
                    }
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-zinc-300">Injection date</span>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                    value={form.vaccinationInjectionDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        vaccinationInjectionDate: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-zinc-300">Location</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  />
                </label>

                <label className="space-y-1 text-sm md:col-span-2 xl:col-span-4">
                  <span className="text-zinc-300">Midwife note</span>
                  <textarea
                    className="min-h-24 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                    value={form.midwifeNote}
                    onChange={(e) =>
                      setForm({ ...form, midwifeNote: e.target.value })
                    }
                  />
                </label>

                <div className="flex gap-3 md:col-span-2 xl:col-span-4">
                  <button
                    disabled={saving}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update card"
                      : "Create card"}
                  </button>

                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <h2 className="mb-4 text-sm font-semibold">All vaccination cards</h2>

            <div className="space-y-3">
              {sortedCards.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No vaccination cards yet.
                </p>
              ) : (
                sortedCards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-xl border border-white/10 bg-black p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{card.vaccineName}</h3>

                        <p className="text-xs text-zinc-500">
                          {card.vaccineType || "No type"} • Dose:{" "}
                          {card.dose || "-"}
                        </p>

                        <p className="mt-2 text-xs text-zinc-400">
                          Due: {card.dueDate}{" "}
                          {card.patientName
                            ? `• Patient: ${card.patientName}`
                            : "• Global card"}
                        </p>

                        {card.midwifeNote ? (
                          <p className="mt-2 text-xs text-zinc-500">
                            {card.midwifeNote}
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
                          onClick={() => startEdit(card)}
                          className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:bg-white/5"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => deleteCard(card.id)}
                          className="rounded-lg border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="h-4 w-4" />
                Upcoming 30 days
              </h2>

              <div className="space-y-3">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No upcoming vaccinations.
                  </p>
                ) : (
                  upcoming.slice(0, 8).map((card) => (
                    <div
                      key={card.id}
                      className="rounded-xl border border-white/10 bg-black p-3"
                    >
                      <p className="text-sm font-medium">{card.vaccineName}</p>
                      <p className="text-xs text-zinc-500">
                        {card.dueDate} • {card.patientName || "Global"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
              <h2 className="mb-4 text-sm font-semibold">
                Eligibility by vaccine
              </h2>

              <div className="space-y-3">
                {eligibility.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No eligible patient data yet.
                  </p>
                ) : (
                  eligibility.map((item) => (
                    <div
                      key={`${item.vaccineName}-${item.vaccineType}-${item.dose}`}
                      className="rounded-xl border border-white/10 bg-black p-3"
                    >
                      <p className="text-sm font-medium">{item.vaccineName}</p>

                      <p className="text-xs text-zinc-500">
                        {item.vaccineType || "No type"} •{" "}
                        {item.dose || "No dose"}
                      </p>

                      <p className="mt-2 text-xl font-bold">
                        {item.eligiblePatients}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}