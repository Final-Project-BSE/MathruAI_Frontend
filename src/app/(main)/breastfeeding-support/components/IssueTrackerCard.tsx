'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Plus, Trash2, Pencil, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/common/useLanguage';
import { translateText } from '@/components/common/translateText';
import type {
  BreastfeedingIssueResponseDto,
  BreastfeedingIssueRequestDto,
} from '@/app/api/breastfeeding/types';
import breastfeedingApi from '@/app/api/breastfeeding/api';
import IssueFormModal from './IssueFormModal';

interface IssueTrackerCardProps {
  issues: BreastfeedingIssueResponseDto[];
  token: string | null;
  onRefresh: () => void;
}

const SEVERITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  MILD: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  MODERATE: { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  SEVERE: { bg: '#fff5f5', border: '#f3c7c8', text: '#d04f51' },
};

const LOCALE_BY_LANGUAGE = {
  en: 'en-US',
  si: 'si-LK',
  ta: 'ta-LK',
} as const;

const IssueTrackerCard: React.FC<IssueTrackerCardProps> = ({
  issues,
  token,
  onRefresh,
}) => {
  const { language, t } = useLanguage();
  const locale = LOCALE_BY_LANGUAGE[language];

  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] =
    useState<BreastfeedingIssueResponseDto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'UNRESOLVED' | 'RESOLVED'>('ALL');
  const [translatedIssueText, setTranslatedIssueText] = useState<Record<string, string>>({});

  const dynamicTextItems = useMemo(
    () =>
      issues.flatMap((issue) => {
        const items: { id: string; value: string }[] = [];

        if (issue.description?.trim()) {
          items.push({
            id: `${issue.id}:description`,
            value: issue.description.trim(),
          });
        }

        if (issue.midwifeNotes?.trim()) {
          items.push({
            id: `${issue.id}:midwifeNotes`,
            value: issue.midwifeNotes.trim(),
          });
        }

        return items;
      }),
    [issues]
  );

  useEffect(() => {
    let active = true;

    const translateDynamicText = async () => {
      if (language === 'en' || dynamicTextItems.length === 0) {
        setTranslatedIssueText({});
        return;
      }

      const entries = await Promise.all(
        dynamicTextItems.map(async (item) => [
          item.id,
          await translateText(item.value, language),
        ] as const)
      );

      if (active) {
        setTranslatedIssueText(Object.fromEntries(entries));
      }
    };

    translateDynamicText();

    return () => {
      active = false;
    };
  }, [language, dynamicTextItems]);

  const getTranslatedText = (id: string, fallback?: string | null) => {
    if (!fallback) return '';
    return translatedIssueText[id] || fallback;
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeletingId(id);
    try {
      await breastfeedingApi.deleteIssue(token, id);
      onRefresh();
    } catch {
      setError(t.breastfeeding.issues.failedDelete);
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkResolved = async (issue: BreastfeedingIssueResponseDto) => {
    if (!token) return;
    try {
      const payload: BreastfeedingIssueRequestDto = {
        issueType: issue.issueType,
        description: issue.description,
        severity: issue.severity,
        reportedAt: issue.reportedAt,
        resolved: true,
        midwifeNotes: issue.midwifeNotes,
      };
      await breastfeedingApi.updateIssue(token, issue.id, payload);
      onRefresh();
    } catch {
      setError(t.breastfeeding.issues.failedUpdate);
    }
  };

  const handleEdit = (issue: BreastfeedingIssueResponseDto) => {
    setEditingIssue(issue);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingIssue(null);
  };

  const handleSaved = () => {
    handleModalClose();
    onRefresh();
  };

  const filteredIssues = issues.filter((i) => {
    if (filter === 'UNRESOLVED') return !i.resolved;
    if (filter === 'RESOLVED') return i.resolved;
    return true;
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-[#d04f51]" />
          <h2 className="text-lg font-semibold text-[#d04f51]">
            {t.breastfeeding.issues.title}
          </h2>
          <span className="rounded-full border border-[#f3c7c8] bg-[#fff5f5] px-2.5 py-0.5 text-xs font-semibold text-[#d04f51]">
            {t.breastfeeding.issues.unresolvedCount(
              issues.filter((i) => !i.resolved).length
            )}
          </span>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#d04f51] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b94345] shadow-[0_10px_25px_rgba(208,79,81,0.28)]"
        >
          <Plus className="h-4 w-4" />
          {t.breastfeeding.issues.reportIssue}
        </Button>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#f3c7c8] bg-[#fff5f5] px-4 py-3 text-sm text-[#7a2d2f]">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xl text-[#d04f51] hover:opacity-70"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      <div className="mb-5 inline-flex w-full rounded-2xl border border-[#f3d6d7] bg-[#fffafa] p-1">
        {(['ALL', 'UNRESOLVED', 'RESOLVED'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={[
              'flex-1 rounded-xl py-2 text-xs font-semibold transition-all duration-200',
              filter === f
                ? 'bg-[#d04f51] text-white shadow-[0_8px_20px_rgba(208,79,81,0.25)]'
                : 'text-[#7a2d2f] hover:bg-[#fff5f5]',
            ].join(' ')}
          >
            {f === 'ALL'
              ? t.breastfeeding.issues.all
              : f === 'UNRESOLVED'
              ? t.breastfeeding.issues.unresolved
              : t.breastfeeding.issues.resolved}
          </button>
        ))}
      </div>

      {filteredIssues.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#f3c7c8] bg-[#fff5f5] p-8 text-center">
          <AlertCircle className="mb-3 h-12 w-12 text-[#d04f51] opacity-40" />
          <p className="text-sm font-semibold text-[#5f3a3b]">
            {filter === 'ALL'
              ? t.breastfeeding.issues.noIssuesTitle
              : filter === 'UNRESOLVED'
              ? t.breastfeeding.issues.noUnresolvedTitle
              : t.breastfeeding.issues.noResolvedTitle}
          </p>
          <p className="mt-1 text-xs text-[#8a4b4c]">
            {filter === 'ALL' && t.breastfeeding.issues.noIssuesDescription}
          </p>
        </div>
      ) : (
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {filteredIssues.map((issue) => {
            const severityStyle =
              SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.MILD;
            const reportedDate = issue.reportedAt
              ? new Date(issue.reportedAt)
              : new Date(issue.createdAt);

            return (
              <div
                key={issue.id}
                className={[
                  'group rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                  issue.resolved
                    ? 'border-[#bbf7d0] bg-[#f0fdf4]'
                    : 'border-[#f1d2d3] bg-white hover:border-[#d04f51]',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-[#5f3a3b]">
                      {t.breastfeeding.labels.issueTypes[issue.issueType] || issue.issueType}
                    </span>

                    <span
                      className="w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: severityStyle.bg,
                        borderColor: severityStyle.border,
                        color: severityStyle.text,
                      }}
                    >
                      {t.breastfeeding.labels.severity[issue.severity] || issue.severity}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {issue.resolved ? (
                      <span className="flex items-center gap-1 rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-2.5 py-1 text-xs font-semibold text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {t.breastfeeding.issues.resolved}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkResolved(issue)}
                        className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#f0fdf4] hover:text-green-700"
                        title={t.breastfeeding.issues.markResolvedTitle}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(issue)}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5] hover:text-[#d04f51]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(issue.id)}
                      disabled={deletingId === issue.id}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5] hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[#5f3a3b]">
                  {getTranslatedText(`${issue.id}:description`, issue.description)}
                </p>

                {issue.midwifeNotes && (
                  <div className="mt-3 rounded-xl border border-[#f3d6d7] bg-[#fffafa] p-3">
                    <p className="mb-1 text-xs font-semibold text-[#d04f51]">
                      {t.breastfeeding.issues.midwifeNotes}
                    </p>
                    <p className="text-sm leading-relaxed text-[#5f3a3b]">
                      {getTranslatedText(`${issue.id}:midwifeNotes`, issue.midwifeNotes)}
                    </p>
                  </div>
                )}

                <p className="mt-3 text-xs text-[#8a4b4c]">
                  {t.breastfeeding.issues.reported}:{' '}
                  {reportedDate.toLocaleDateString(locale, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <IssueFormModal
          token={token}
          editingIssue={editingIssue}
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default IssueTrackerCard;
