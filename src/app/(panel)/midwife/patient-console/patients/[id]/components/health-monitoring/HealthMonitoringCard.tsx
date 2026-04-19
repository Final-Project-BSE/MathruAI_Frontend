"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Pencil, Plus } from "lucide-react";
import type {
  HealthMonitoringResponseDto,
  HealthMonitoringUpsertRequestDto,
} from "../../../../../../../api/healthmonitor/types";
import { formatDate } from "../lib/utils";
import {
  getCachedHealthMonitoringBundle,
  setCachedHealthMonitoringBundle,
} from "../lib/patientConsoleCache";
import HealthMonitoringDetailsModal from "./HealthMonitoringDetailsModal";
import HealthMonitoringEditModal from "./HealthMonitoringEditModal";
import { riskTone } from "./riskTone";

type HealthMonitoringCardProps = {
  patientId: number;
  monitoring: HealthMonitoringResponseDto | null;
  loading?: boolean;
  saving?: boolean;
  deleting?: boolean;
  canEdit?: boolean;
  onSave: (payload: HealthMonitoringUpsertRequestDto) => void | Promise<void>;
  onDelete?: (record: HealthMonitoringResponseDto) => void | Promise<void>;
};

export default function HealthMonitoringCard({
  patientId,
  monitoring,
  loading = false,
  saving = false,
  deleting = false,
  canEdit = true,
  onSave,
  onDelete,
}: HealthMonitoringCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [latestMonitoring, setLatestMonitoring] =
    useState<HealthMonitoringResponseDto | null>(null);

  useEffect(() => {
    const cached = getCachedHealthMonitoringBundle(patientId);
    setLatestMonitoring(monitoring ?? cached?.monitoring ?? null);
    setShowDetailsModal(false);
    setShowEditModal(false);
  }, [patientId, monitoring]);

  useEffect(() => {
    setCachedHealthMonitoringBundle(patientId, {
      monitoring: latestMonitoring,
    });
  }, [patientId, latestMonitoring]);

  const mainTone = useMemo(
    () => riskTone(latestMonitoring?.riskLevel),
    [latestMonitoring?.riskLevel]
  );

  const mainHighRiskBreakdown = useMemo(() => {
    if (!latestMonitoring?.riskProbabilities) return [];

    return Object.entries(latestMonitoring.riskProbabilities).filter(([label]) =>
      label.toLowerCase().includes("high")
    );
  }, [latestMonitoring?.riskProbabilities]);

  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-md font-semibold text-white">
              <Activity className="h-5 w-5 text-zinc-300" />
              Health Monitoring
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Latest risk summary
            </p>
          </div>

          <div className="flex items-center gap-2">
            {latestMonitoring ? (
              <button
                type="button"
                onClick={() => setShowDetailsModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition hover:bg-white/10"
              >
                See More Details
              </button>
            ) : null}

            {canEdit ? (
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition hover:bg-white/10"
              >
                {latestMonitoring ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {latestMonitoring ? "Update Data" : "Add Data"}
              </button>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-6 text-xs text-zinc-500">
            Loading latest health monitoring data...
          </div>
        ) : !latestMonitoring ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-6 text-xs text-zinc-500">
            No health monitoring data available yet.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${mainTone.badge}`}
              >
                Risk Level: {latestMonitoring.riskLevel || "Unknown"}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                Risk Confidence:{" "}
                {Math.round((latestMonitoring.riskConfidence || 0) * 100)}%
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
                Updated:{" "}
                {formatDate(
                  latestMonitoring.updatedAt || latestMonitoring.createdAt
                )}
              </span>
            </div>

            {mainHighRiskBreakdown.length > 0 ? (
              <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
                <div className="mb-1 text-xs font-medium text-zinc-200">
                  Risk Level
                </div>
                <div className="space-y-2">
                  {mainHighRiskBreakdown.map(([label, value]) => {
                    const percent = Math.max(
                      0,
                      Math.min(100, Number(value) * 100)
                    );

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
          </div>
        )}
      </section>

      <HealthMonitoringDetailsModal
        open={showDetailsModal}
        monitoring={latestMonitoring}
        onClose={() => setShowDetailsModal(false)}
      />

      <HealthMonitoringEditModal
        open={showEditModal}
        monitoring={latestMonitoring}
        saving={saving}
        deleting={deleting}
        onClose={() => setShowEditModal(false)}
        onSave={onSave}
        onDelete={onDelete}
      />
    </>
  );
}