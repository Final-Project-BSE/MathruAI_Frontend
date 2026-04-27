"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Loader2, MapPin, Syringe, X } from "lucide-react";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";
import { vaccinationApi } from "@/app/api/vaccination/api";
import type {
  VaccinationCardResponseDto,
  VaccinationStatus,
} from "@/app/api/vaccination/types";

type Props = {
  open: boolean;
  onClose: () => void;
};

const tabs: VaccinationStatus[] = ["PENDING", "COMPLETED", "MISSED"];

function label(status: VaccinationStatus) {
  if (status === "PENDING") return "Pending";
  if (status === "COMPLETED") return "Completed";
  return "Missed";
}

function statusClass(status: VaccinationStatus) {
  if (status === "COMPLETED")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";

  if (status === "MISSED")
    return "border-red-200 bg-red-50 text-red-700";

  return "border-yellow-200 bg-yellow-50 text-yellow-700";
}

export default function VaccinationPopup({ open, onClose }: Props) {
  const [cards, setCards] = useState<VaccinationCardResponseDto[]>([]);
  const [activeTab, setActiveTab] = useState<VaccinationStatus>("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadCards() {
      try {
        setLoading(true);
        setError("");

        const session = await getSession();
        const token = session?.user?.token || "";

        if (!token) {
          throw new Error("You are not authenticated.");
        }

        const me = await getcuruser(token);
        const data = await vaccinationApi.getPatientSideCards(token, me.id);

        if (!active) return;

        setCards(data);
      } catch (err) {
        if (!active) return;

        setCards([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load vaccination details."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCards();

    return () => {
      active = false;
    };
  }, [open]);

  const groupedCounts = useMemo(() => {
    return {
      PENDING: cards.filter((card) => card.status === "PENDING").length,
      COMPLETED: cards.filter((card) => card.status === "COMPLETED").length,
      MISSED: cards.filter((card) => card.status === "MISSED").length,
    };
  }, [cards]);

  const visibleCards = useMemo(() => {
    return cards.filter((card) => card.status === activeTab);
  }, [cards, activeTab]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <Syringe className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold">My Vaccinations</h2>
              <p className="text-sm text-white/90">
                View vaccination cards assigned by your midwife
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white transition hover:bg-white/20"
            aria-label="Close vaccination popup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-96px)] overflow-y-auto bg-[#fed2cc] p-4 md:p-6">
          <div className="mb-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "border-[#d04f51] bg-[#d04f51] text-white shadow-sm"
                    : "border-zinc-200 bg-white text-black hover:border-[#d04f51] hover:text-[#d04f51]"
                }`}
              >
                {label(tab)} ({groupedCounts[tab]})
              </button>
            ))}
          </div>

          {error ? (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="flex justify-center py-16 text-[#d04f51]">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading vaccination records...
            </div>
          ) : visibleCards.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
              No {label(activeTab).toLowerCase()} vaccination cards.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleCards.map((card) => (
                <article
                  key={card.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-950">
                        {card.vaccineName}
                      </h3>

                      <p className="mt-1 text-xs text-zinc-800">
                        {card.vaccineType || "No type"} • Dose:{" "}
                        {card.dose || "-"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusClass(
                        card.status
                      )}`}
                    >
                      {card.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-800">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Due date: {card.dueDate}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Injection date: {card.vaccinationInjectionDate || "-"}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Completed date: {card.completedDate || "-"}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location: {card.location || "-"}
                    </p>
                  </div>

                  {card.midwifeNote ? (
                    <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                      <p className="text-xs text-zinc-600">Midwife note</p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {card.midwifeNote}
                      </p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}