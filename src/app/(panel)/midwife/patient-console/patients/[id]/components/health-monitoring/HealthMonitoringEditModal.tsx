"use client";

import { Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  HealthMonitoringResponseDto,
  HealthMonitoringUpsertRequestDto,
} from "../../../../../../../api/healthmonitor/types";
import Select01 from "./Select01";
import {
  buildFormState,
  FormState,
  validateAndBuildPayload,
} from "./healthMonitoringForm";

type Props = {
  open: boolean;
  monitoring: HealthMonitoringResponseDto | null;
  saving?: boolean;
  deleting?: boolean;
  onClose: () => void;
  onSave: (payload: HealthMonitoringUpsertRequestDto) => void | Promise<void>;
  onDelete?: (record: HealthMonitoringResponseDto) => void | Promise<void>;
};

export default function HealthMonitoringEditModal({
  open,
  monitoring,
  saving = false,
  deleting = false,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [form, setForm] = useState<FormState>(buildFormState(monitoring));
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(buildFormState(monitoring));
    setError("");
  }, [monitoring, open]);

  async function handleSubmit() {
    const result = validateAndBuildPayload(form);

    if (result.error) {
      setError(result.error);
      return;
    }

    try {
      setError("");
      await onSave(result.payload!);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save health monitoring data."
      );
    }
  }

  async function handleDelete() {
    if (!monitoring || !onDelete) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this health monitoring record?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await onDelete(monitoring);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete health monitoring data."
      );
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-black shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {monitoring ? "Update Health Monitoring" : "Add Health Monitoring"}
            </h3>
            <p className="text-sm text-zinc-400">
              Record vitals and risk factors for the assigned patient.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Age", "age"],
              ["Systolic BP", "systolicBP"],
              ["Diastolic BP", "diastolicBP"],
              ["Blood Sugar", "bs"],
              ["Body Temperature", "bodyTemp"],
              ["BMI", "bmi"],
              ["Heart Rate", "heartRate"],
            ].map(([label, key]) => (
              <label key={key} className="space-y-2">
                <span className="text-sm text-zinc-400">{label}</span>
                <input
                  type="number"
                  value={form[key as keyof FormState]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
                />
              </label>
            ))}

            <Select01
              label="Previous Complications"
              value={form.previousComplications}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, previousComplications: value }))
              }
            />

            <Select01
              label="Preexisting Diabetes"
              value={form.preexistingDiabetes}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, preexistingDiabetes: value }))
              }
            />

            <Select01
              label="Gestational Diabetes"
              value={form.gestationalDiabetes}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, gestationalDiabetes: value }))
              }
            />

            <Select01
              label="Mental Health"
              value={form.mentalHealth}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, mentalHealth: value }))
              }
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              {monitoring && onDelete ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting || saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete Data
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || deleting}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {monitoring ? "Save Changes" : "Save Data"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}