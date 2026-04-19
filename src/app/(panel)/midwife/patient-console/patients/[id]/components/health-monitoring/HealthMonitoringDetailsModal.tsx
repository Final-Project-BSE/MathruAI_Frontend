"use client";

import { X } from "lucide-react";
import { useMemo } from "react";
import type { HealthMonitoringResponseDto } from "../../../../../../../api/healthmonitor/types";
import { formatDate } from "../lib/utils";
import BinaryBadge from "./BinaryBadge";
import HealthMetric from "./HealthMetric";
import { riskTone } from "./riskTone";

type Props = {
  open: boolean;
  monitoring: HealthMonitoringResponseDto | null;
  onClose: () => void;
};

export default function HealthMonitoringDetailsModal({
  open,
  monitoring,
  onClose,
}: Props) {
  const popupTone = useMemo(
    () => riskTone(monitoring?.riskLevel),
    [monitoring?.riskLevel]
  );

  const popupHighRiskBreakdown = useMemo(() => {
    if (!monitoring?.riskProbabilities) return [];

    return Object.entries(monitoring.riskProbabilities).filter(([label]) =>
      label.toLowerCase().includes("high")
    );
  }, [monitoring?.riskProbabilities]);

  if (!open || !monitoring) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-black shadow-2xl">
        <div className="sticky top-0 z-[999] border-b border-white/10 bg-black px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <h3 className="text-md font-semibold text-white">
                Health Monitoring Details
              </h3>
              <p className="text-xs text-zinc-400">
                Detailed view of the latest monitoring record.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${popupTone.badge}`}
            >
              Risk Level: {monitoring.riskLevel || "Unknown"}
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
              Updated: {formatDate(monitoring.updatedAt || monitoring.createdAt)}
            </span>
          </div>

          {popupHighRiskBreakdown.length > 0 ? (
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
              <div className="mb-1 text-xs font-medium text-zinc-200">
                Risk Level
              </div>
              <div className="space-y-2">
                {popupHighRiskBreakdown.map(([label, value]) => {
                  const percent = Math.max(0, Math.min(100, Number(value) * 100));

                  return (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
                        <span>{Math.round(percent)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-black/40">
                        <div
                          className="h-full rounded-full bg-white"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className={`rounded-xl p-4 ${popupTone.badge}`}>
            <div className="mb-3 text-xs font-medium text-zinc-200">
              Health Advice
            </div>
            <p className="text-xs leading-6 text-zinc-300">
              {monitoring.healthAdvice || "No advice available."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            <HealthMetric label="Age" value={monitoring.age} />
            <HealthMetric label="Systolic BP" value={monitoring.systolicBP} />
            <HealthMetric label="Diastolic BP" value={monitoring.diastolicBP} />
            <HealthMetric label="Blood Sugar" value={monitoring.bs} />
            <HealthMetric label="Body Temperature" value={monitoring.bodyTemp} />
            <HealthMetric label="BMI" value={monitoring.bmi} />
            <HealthMetric label="Heart Rate" value={monitoring.heartRate} />
          </div>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            <BinaryBadge
              label="Previous Complications"
              value={monitoring.previousComplications}
            />
            <BinaryBadge
              label="Preexisting Diabetes"
              value={monitoring.preexistingDiabetes}
            />
            <BinaryBadge
              label="Gestational Diabetes"
              value={monitoring.gestationalDiabetes}
            />
            <BinaryBadge
              label="Mental Health Risk"
              value={monitoring.mentalHealth}
            />
          </div>
        </div>
      </div>
    </div>
  );
}