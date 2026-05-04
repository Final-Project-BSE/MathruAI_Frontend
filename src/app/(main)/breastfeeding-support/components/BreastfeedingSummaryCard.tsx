import React from 'react';
import { Activity, AlertCircle, Clock, Droplets } from 'lucide-react';
import type { BreastfeedingSession, BreastfeedingIssue } from './BreastfeedingDashboard';

interface BreastfeedingSummaryCardProps {
  sessions: BreastfeedingSession[];
  issues: BreastfeedingIssue[];
}

const BreastfeedingSummaryCard: React.FC<BreastfeedingSummaryCardProps> = ({
  sessions,
  issues,
}) => {
  const todaySessions = sessions.filter((s) => {
    const today = new Date().toISOString().split('T')[0];
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
      label: "Today's Sessions",
      value: todaySessions.length,
      unit: 'sessions',
      icon: Activity,
      color: '#d04f51',
      bg: '#fff5f5',
      border: '#f3c7c8',
    },
    {
      label: 'Total Duration Today',
      value: totalDurationToday,
      unit: 'minutes',
      icon: Clock,
      color: '#d04f51',
      bg: '#fff5f5',
      border: '#f3c7c8',
    },
    {
      label: 'Milk Expressed Today',
      value: totalMilkToday,
      unit: 'ml',
      icon: Droplets,
      color: '#d04f51',
      bg: '#fff5f5',
      border: '#f3c7c8',
    },
    {
      label: 'Unresolved Issues',
      value: unresolvedIssues,
      unit: 'issues',
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
          Today's Overview
        </h2>
        <span className="rounded-full bg-[#fff5f5] border border-[#f3c7c8] px-3 py-0.5 text-xs font-medium text-[#d04f51]">
          {new Date().toLocaleDateString('en-US', {
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
              <div
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <Icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <p
                className="text-3xl font-bold"
                style={{ color: stat.color }}
              >
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

      {/* Total sessions all time */}
      <div className="mt-4 rounded-2xl border border-[#f3d6d7] bg-[#fffafa] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#5f3a3b]">
              Total Sessions Logged
            </p>
            <p className="text-xs text-[#8a4b4c]">
              All time breastfeeding records
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
              {todaySessions.length} of {sessions.length} sessions are from today
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreastfeedingSummaryCard;