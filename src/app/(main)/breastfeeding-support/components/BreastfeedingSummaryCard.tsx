import React from 'react';
import { Activity, AlertCircle, Clock, Droplets } from 'lucide-react';
import { useLanguage } from '@/components/common/useLanguage';
import type {
  BreastfeedingSessionResponseDto,
  BreastfeedingIssueResponseDto,
} from '@/app/api/breastfeeding/types';

interface BreastfeedingSummaryCardProps {
  sessions: BreastfeedingSessionResponseDto[];
  issues: BreastfeedingIssueResponseDto[];
}

const LOCALE_BY_LANGUAGE = {
  en: 'en-US',
  si: 'si-LK',
  ta: 'ta-LK',
} as const;

const BreastfeedingSummaryCard: React.FC<BreastfeedingSummaryCardProps> = ({
  sessions,
  issues,
}) => {
  const { language, t } = useLanguage();
  const locale = LOCALE_BY_LANGUAGE[language];

  const today = new Date().toISOString().split('T')[0];

  const todaySessions = sessions.filter((s) => {
    return s.feedingTime?.startsWith(today);
  });

  const totalDurationToday = todaySessions.reduce(
    (acc, s) => acc + (s.durationMinutes || 0),
    0
  );

  const totalMilkToday = todaySessions.reduce(
    (acc, s) => acc + (s.milkAmountMl || 0),
    0
  );

  const unresolvedIssues = issues.filter((i) => !i.resolved).length;

  const stats = [
    {
      label: t.breastfeeding.summary.todaySessions,
      value: todaySessions.length,
      unit: t.breastfeeding.summary.sessionsUnit,
      icon: Activity,
      color: '#d04f51',
      bg: '#fff5f5',
      border: '#f3c7c8',
    },
    {
      label: t.breastfeeding.summary.totalDurationToday,
      value: totalDurationToday,
      unit: t.breastfeeding.summary.minutesUnit,
      icon: Clock,
      color: '#d04f51',
      bg: '#fff5f5',
      border: '#f3c7c8',
    },
    {
      label: t.breastfeeding.summary.milkExpressedToday,
      value: totalMilkToday,
      unit: t.breastfeeding.summary.mlUnit,
      icon: Droplets,
      color: '#d04f51',
      bg: '#fff5f5',
      border: '#f3c7c8',
    },
    {
      label: t.breastfeeding.summary.unresolvedIssues,
      value: unresolvedIssues,
      unit: t.breastfeeding.summary.issuesUnit,
      icon: AlertCircle,
      color: unresolvedIssues > 0 ? '#b45309' : '#d04f51',
      bg: unresolvedIssues > 0 ? '#fffbeb' : '#fff5f5',
      border: unresolvedIssues > 0 ? '#fde68a' : '#f3c7c8',
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-base font-semibold text-[#d04f51]">
          {t.breastfeeding.summary.overviewTitle}
        </h2>
        <span className="rounded-full bg-[#fff5f5] border border-[#f3c7c8] px-3 py-0.5 text-xs font-medium text-[#d04f51]">
          {new Date().toLocaleDateString(locale, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                borderColor: stat.border,
                backgroundColor: stat.bg,
              }}
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                {stat.unit}
              </p>
              <p className="mt-1 text-xs text-[#8a4b4c]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-[#f3d6d7] bg-[#fffafa] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#5f3a3b]">
              {t.breastfeeding.summary.totalSessionsLogged}
            </p>
            <p className="text-xs text-[#8a4b4c]">
              {t.breastfeeding.summary.allTimeRecords}
            </p>
          </div>
          <p className="text-3xl font-bold text-[#d04f51]">
            {sessions.length}
          </p>
        </div>

        {sessions.length > 0 && (
          <div className="mt-3">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[#d04f51] transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min((todaySessions.length / Math.max(sessions.length, 1)) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="mt-1 text-xs text-[#8a4b4c]">
              {t.breastfeeding.summary.todayProgress(todaySessions.length, sessions.length)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreastfeedingSummaryCard;
