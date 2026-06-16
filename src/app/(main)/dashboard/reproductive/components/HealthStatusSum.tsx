"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, HeartPulse, Clock3 } from "lucide-react";

import apis from "../../../../api/healthmonitor/api";
import type { PredictionResult } from "../../../../api/healthmonitor/types";
import { useLanguage } from "../../../../../components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

type Props = {
  href?: string;
};

type PredictionResultWithTimestamps = PredictionResult & {
  updated_at?: string | number | Date | null;
  created_at?: string | number | Date | null;
};

function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function safeNum(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatTimeAgo(
  dateLike: string | number | Date | null | undefined,
  text: ReturnType<typeof useLanguage>["t"]
) {
  if (!dateLike) return null;

  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;

  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return text.reproductive.health.justNow;
  if (mins < 60) return `${mins} ${text.reproductive.health.minAgo}`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ${text.reproductive.health.hrAgo}`;

  const days = Math.floor(hrs / 24);
  return `${days} ${
    days > 1
      ? text.reproductive.health.daysAgo
      : text.reproductive.health.dayAgo
  }`;
}

function getRiskStyles(
  riskLevel: string | null | undefined,
  text: ReturnType<typeof useLanguage>["t"]
) {
  if (!riskLevel) {
    return {
      label: text.reproductive.health.noAssessment,
      badge: "bg-gray-100 text-gray-700 border-gray-200",
      dot: "bg-gray-400",
      progressColor: "#9CA3AF",
      translatedByStaticMap: true,
    };
  }

  const r = riskLevel.toLowerCase();

  if (r.includes("low")) {
    return {
      label: text.reproductive.health.goodHealth,
      badge: "bg-green-700 text-white border-green-200",
      dot: "bg-white",
      progressColor: "#16A34A",
      translatedByStaticMap: true,
    };
  }

  if (r.includes("mid") || r.includes("medium") || r.includes("moderate")) {
    return {
      label: text.reproductive.health.needsAttention,
      badge: "bg-yellow-50 text-yellow-800 border-yellow-200",
      dot: "bg-yellow-500",
      progressColor: "#F59E0B",
      translatedByStaticMap: true,
    };
  }

  if (r.includes("high")) {
    return {
      label: text.reproductive.health.highRisk,
      badge: "bg-red-500 text-white border-red-200",
      dot: "bg-white",
      progressColor: "#EF4444",
      translatedByStaticMap: true,
    };
  }

  return {
    label: riskLevel,
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
    progressColor: "#9CA3AF",
    translatedByStaticMap: false,
  };
}

function CircularProgress({
  value,
  label,
  sublabel,
  color,
}: {
  value: number;
  label: string;
  sublabel?: string;
  color: string;
}) {
  const pct = clamp(value) * 100;

  const ring = `conic-gradient(from 180deg, ${color} ${pct}%, rgba(255,255,255,0.35) 0)`;

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-14 w-14 rounded-full p-[2px] shadow-sm"
        style={{ background: ring }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
          <div className="text-sm font-bold text-gray-900">
            {pct.toFixed(0)}%
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          {label}
        </div>
        {sublabel && <div className="text-xs text-gray-600">{sublabel}</div>}
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-xs font-medium text-gray-600">{title}</div>
          <div className="text-lg font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function HealthStatusSum({ href = "/health-monitoring" }: Props) {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [translatedRiskLevel, setTranslatedRiskLevel] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();
        const token = session?.user?.token;

        if (!token) {
          setLatest(null);
          setError(t.reproductive.health.loginRequired);
          return;
        }

        const res = await apis.getLatest(token);
        setLatest(res ?? null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : t.reproductive.health.failed);
        setLatest(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [t]);

  const vitals = latest?.vitals;

  const bmi = safeNum(vitals?.BMI);
  const sys = safeNum(vitals?.SystolicBP);
  const dia = safeNum(vitals?.DiastolicBP);
  const hr = safeNum(vitals?.HeartRate);

  const riskLevel = latest?.risk_assessment?.risk_level ?? null;
  const confidence =
    typeof latest?.risk_assessment?.confidence === "number"
      ? latest.risk_assessment.confidence
      : null;

  const status = useMemo(() => getRiskStyles(riskLevel, t), [riskLevel, t]);

  useEffect(() => {
    let cancelled = false;

    async function translateRiskLevelText() {
      if (!riskLevel || language === "en" || status.translatedByStaticMap) {
        setTranslatedRiskLevel(riskLevel || "");
        return;
      }

      const translated = await translateText(riskLevel, language);

      if (!cancelled) {
        setTranslatedRiskLevel(translated);
      }
    }

    translateRiskLevelText();

    return () => {
      cancelled = true;
    };
  }, [riskLevel, language, status.translatedByStaticMap]);

  const latestWithTimestamps = latest as PredictionResultWithTimestamps | null;

  const updatedAgo = formatTimeAgo(
    latestWithTimestamps?.updated_at ?? latestWithTimestamps?.created_at ?? null,
    t
  );

  const assessmentValue =
    language === "en" || status.translatedByStaticMap
      ? riskLevel
      : translatedRiskLevel || riskLevel;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => router.push(href)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-lg transition-all hover:shadow-xl"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: "url('/images/reproductive/risk4.jpg')",
        }}
      />

      <div className="relative z-10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50">
                <HeartPulse className="h-5 w-5 text-[#d04f51]" />
              </div>

              <div>
                <div className="font-bold">{t.reproductive.health.title}</div>

                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                  <span
                    className={`rounded-full border px-2 py-1 ${status.badge}`}
                  >
                    <span
                      className={`mr-1 inline-block h-2 w-2 rounded-full ${status.dot}`}
                    />
                    {status.label}
                  </span>

                  {updatedAgo && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock3 className="h-3 w-3" />
                      {updatedAgo}
                    </span>
                  )}
                </div>
              </div>
            </CardTitle>

            <Button
              className="bg-[#ffffff] text-black hover:bg-[#d04f51] hover:text-white"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(href);
              }}
            >
              {t.dashboard.monitor} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.reproductive.health.loading}
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : !latest || !vitals ? (
            <div className="text-sm text-gray-600">
              {t.reproductive.health.noSaved}
            </div>
          ) : (
            <>
              <CircularProgress
                value={confidence ?? 0}
                label={t.reproductive.health.riskConfidence}
                sublabel={
                  assessmentValue
                    ? `${t.reproductive.health.assessment}: ${assessmentValue}`
                    : undefined
                }
                color={status.progressColor}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricCard
                  title={t.reproductive.health.bmi}
                  value={bmi ? bmi.toFixed(1) : "-"}
                />

                <MetricCard
                  title={t.reproductive.health.bloodPressure}
                  value={sys && dia ? `${sys}/${dia}` : "-"}
                />

                <MetricCard
                  title={t.reproductive.health.heartRate}
                  value={hr ? `${hr.toFixed(0)} bpm` : "-"}
                />
              </div>
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
}