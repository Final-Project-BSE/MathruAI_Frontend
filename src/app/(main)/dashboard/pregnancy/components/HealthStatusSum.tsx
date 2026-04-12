'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  ChevronRight,
  Sparkles,
  HeartPulse,
  Activity,
  Clock3,
} from 'lucide-react';

import apis from '../../../../api/healthmonitor/api';
import type { PredictionResult } from '../../../../api/healthmonitor/types';

type Props = {
  href?: string;
};

function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function safeNum(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatTimeAgo(dateLike?: string | number | Date | null) {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;

  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function getRiskStyles(riskLevel?: string | null) {
  if (!riskLevel) {
    return {
      label: 'No assessment yet',
      badge: 'bg-gray-100 text-gray-700 border-gray-200',
      dot: 'bg-gray-400',
      progressColor: '#9CA3AF', // gray
    };
  }

  const r = riskLevel.toLowerCase();

  if (r.includes('low')) {
    return {
      label: 'Good Health Status',
      badge: 'bg-green-700 text-white border-green-200',
      dot: 'bg-white',
      progressColor: '#16A34A', // green
    };
  }

  if (r.includes('mid') || r.includes('medium') || r.includes('moderate')) {
    return {
      label: 'Needs Attention',
      badge: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      dot: 'bg-yellow-500',
      progressColor: '#F59E0B', // amber
    };
  }

  if (r.includes('high')) {
    return {
      label: 'High Risk',
      badge: 'bg-red-500 text-white border-red-200',
      dot: 'bg-white',
      progressColor: '#EF4444', // red
    };
  }

  return {
    label: riskLevel,
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
    progressColor: '#9CA3AF',
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
          <div className="text-sm font-bold text-gray-900">{pct.toFixed(0)}%</div>
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

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
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

export default function HealthStatusSum({
  href = '/health-monitoring',
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const { getSession } = await import('@/lib/authentication');
        const session = await getSession();
        const token = session?.user?.token;

        if (!token) {
          setLatest(null);
          setError('Please log in to see your health summary.');
          return;
        }

        const res = await apis.getLatest(token);
        setLatest(res ?? null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load summary.');
        setLatest(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const vitals = latest?.vitals;

  const bmi = safeNum(vitals?.BMI);
  const sys = safeNum(vitals?.SystolicBP);
  const dia = safeNum(vitals?.DiastolicBP);
  const hr = safeNum(vitals?.HeartRate);

  const riskLevel = latest?.risk_assessment?.risk_level ?? null;
  const confidence =
    typeof latest?.risk_assessment?.confidence === 'number'
      ? latest.risk_assessment.confidence
      : null;

  const status = useMemo(() => getRiskStyles(riskLevel), [riskLevel]);

  const updatedAgo = formatTimeAgo(
    (latest as any)?.updated_at || (latest as any)?.created_at || null
  );

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => router.push(href)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-lg transition-all hover:shadow-xl"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: "url('/images/reproductive/risk4.jpg')",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50">
                <HeartPulse className="h-5 w-5 text-[#d04f51]" />
              </div>

              <div>
                <div className="font-bold">Health Status Summary</div>

                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                  <span className={`rounded-full border px-2 py-1 ${status.badge}`}>
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
              Monitor <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading health status...
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : !latest || !vitals ? (
            <div className="text-sm text-gray-600">
              No saved assessment yet. Click to add vitals and get your first
              assessment.
            </div>
          ) : (
            <>
              <CircularProgress
                value={confidence ?? 0}
                label="Risk Confidence"
                sublabel={riskLevel ? `Assessment: ${riskLevel}` : undefined}
                color={status.progressColor}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricCard
                  title="BMI"
                  value={bmi ? bmi.toFixed(1) : '-'}
                />

                <MetricCard
                  title="Blood Pressure"
                  value={sys && dia ? `${sys}/${dia}` : '-'}
                />

                <MetricCard
                  title="Heart Rate"
                  value={hr ? `${hr.toFixed(0)} bpm` : '-'}
                />
              </div>
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
}