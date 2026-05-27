'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/common/useLanguage';
import type {
  BreastfeedingIssueResponseDto,
  BreastfeedingIssueRequestDto,
  IssueType,
  SeverityLevel,
} from '@/app/api/breastfeeding/types';
import breastfeedingApi from '@/app/api/breastfeeding/api';

interface IssueFormModalProps {
  token: string | null;
  editingIssue: BreastfeedingIssueResponseDto | null;
  onClose: () => void;
  onSaved: () => void;
}

const ISSUE_TYPES: IssueType[] = [
  'PAIN',
  'LATCH_PROBLEM',
  'LOW_SUPPLY',
  'ENGORGEMENT',
  'MASTITIS',
  'OTHER',
];

const SEVERITY_LEVELS: {
  value: SeverityLevel;
  bg: string;
  border: string;
  active: string;
}[] = [
  { value: 'MILD', bg: '#f0fdf4', border: '#bbf7d0', active: '#15803d' },
  { value: 'MODERATE', bg: '#fffbeb', border: '#fde68a', active: '#b45309' },
  { value: 'SEVERE', bg: '#fff5f5', border: '#f3c7c8', active: '#d04f51' },
];

const IssueFormModal: React.FC<IssueFormModalProps> = ({
  token,
  editingIssue,
  onClose,
  onSaved,
}) => {
  const { t } = useLanguage();

  const [issueType, setIssueType] = useState<IssueType>('PAIN');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('MILD');
  const [reportedAt, setReportedAt] = useState('');
  const [resolved, setResolved] = useState(false);
  const [midwifeNotes, setMidwifeNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingIssue) {
      setIssueType(editingIssue.issueType);
      setDescription(editingIssue.description || '');
      setSeverity(editingIssue.severity);
      setResolved(editingIssue.resolved);
      setMidwifeNotes(editingIssue.midwifeNotes || '');

      if (editingIssue.reportedAt) {
        const dt = new Date(editingIssue.reportedAt);
        const localISO = new Date(
          dt.getTime() - dt.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);
        setReportedAt(localISO);
      }
    } else {
      const now = new Date();
      const localISO = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      setReportedAt(localISO);
    }
  }, [editingIssue]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = t.breastfeeding.issueForm.validationDescription;
    }
    if (!reportedAt) {
      newErrors.reportedAt = t.breastfeeding.issueForm.validationReportedAt;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!token || !validate()) return;

    setLoading(true);
    setError(null);

    try {
      const payload: BreastfeedingIssueRequestDto = {
        issueType,
        description,
        severity,
        reportedAt: new Date(reportedAt).toISOString().slice(0, 19),
        resolved,
        midwifeNotes,
      };

      if (editingIssue) {
        await breastfeedingApi.updateIssue(token, editingIssue.id, payload);
      } else {
        await breastfeedingApi.createIssue(token, payload);
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t.breastfeeding.issueForm.saveFailed
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <Card className="my-6 w-full max-w-lg rounded-3xl border-0 bg-white shadow-[0_20px_60px_rgba(208,79,81,0.18)]">
        <CardHeader className="border-b border-[#f3d6d7] pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#d04f51]">
              <AlertCircle className="h-5 w-5" />
              <span className="text-lg font-semibold">
                {editingIssue
                  ? t.breastfeeding.issueForm.editTitle
                  : t.breastfeeding.issueForm.createTitle}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-[#8a4b4c] transition-colors hover:text-[#d04f51]"
              aria-label="Close"
            >
              ×
            </button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          {error && (
            <div className="rounded-2xl border border-[#f3c7c8] bg-[#fff5f5] px-4 py-3 text-sm text-[#7a2d2f]">
              {error}
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              {t.breastfeeding.issueForm.issueType}{' '}
              <span className="text-[#d04f51]">*</span>
            </Label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ISSUE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setIssueType(type)}
                  className={[
                    'rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200',
                    issueType === type
                      ? 'border-[#d04f51] bg-[#d04f51] text-white shadow-[0_8px_20px_rgba(208,79,81,0.25)]'
                      : 'border-[#f3d6d7] bg-white text-[#5f3a3b] hover:bg-[#fff5f5]',
                  ].join(' ')}
                >
                  {t.breastfeeding.labels.issueTypes[type]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              {t.breastfeeding.issueForm.severity}{' '}
              <span className="text-[#d04f51]">*</span>
            </Label>
            <div className="mt-2 flex gap-3">
              {SEVERITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setSeverity(level.value)}
                  className={[
                    'flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all duration-200',
                    severity === level.value ? 'shadow-md' : 'hover:opacity-80',
                  ].join(' ')}
                  style={
                    severity === level.value
                      ? {
                          backgroundColor: level.bg,
                          borderColor: level.active,
                          color: level.active,
                        }
                      : {
                          backgroundColor: level.bg,
                          borderColor: level.border,
                          color: level.active,
                        }
                  }
                >
                  {t.breastfeeding.labels.severity[level.value]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              {t.breastfeeding.issueForm.description}{' '}
              <span className="text-[#d04f51]">*</span>
            </Label>
            <Textarea
              rows={3}
              placeholder={t.breastfeeding.issueForm.descriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`mt-1 resize-none rounded-xl border-[#f3d6d7] focus:border-[#d04f51] focus:ring-[#d04f51] ${
                errors.description ? 'border-red-400' : ''
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              {t.breastfeeding.issueForm.reportedAt}{' '}
              <span className="text-[#d04f51]">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={reportedAt}
              onChange={(e) => setReportedAt(e.target.value)}
              className={`mt-1 rounded-xl border-[#f3d6d7] focus:border-[#d04f51] focus:ring-[#d04f51] ${
                errors.reportedAt ? 'border-red-400' : ''
              }`}
            />
            {errors.reportedAt && (
              <p className="mt-1 text-xs text-red-500">{errors.reportedAt}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              {t.breastfeeding.issueForm.midwifeNotes}{' '}
              <span className="text-xs font-normal text-[#8a4b4c]">
                {t.breastfeeding.issueForm.addedByMidwife}
              </span>
            </Label>
            <div className="mt-1 min-h-[60px] rounded-xl border border-[#f3d6d7] bg-[#fffafa] px-3 py-2 text-sm text-[#8a4b4c]">
              {midwifeNotes ? (
                midwifeNotes
              ) : (
                <span className="italic text-[#c0a0a0]">
                  {t.breastfeeding.issueForm.noMidwifeNotes}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#f3d6d7] bg-[#fffafa] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#5f3a3b]">
                {t.breastfeeding.issueForm.markResolved}
              </p>
              <p className="text-xs text-[#8a4b4c]">
                {t.breastfeeding.issueForm.markResolvedDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setResolved((prev) => !prev)}
              className={[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                resolved ? 'bg-[#d04f51]' : 'bg-gray-200',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200',
                  resolved ? 'translate-x-5' : 'translate-x-1',
                ].join(' ')}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl border-[#f3d6d7] text-[#7a2d2f] hover:bg-[#fff5f5]"
            >
              {t.breastfeeding.issueForm.cancel}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-xl bg-[#d04f51] text-white hover:bg-[#b94345] shadow-[0_10px_25px_rgba(208,79,81,0.28)]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.breastfeeding.issueForm.saving}
                </>
              ) : editingIssue ? (
                t.breastfeeding.issueForm.updateIssue
              ) : (
                t.breastfeeding.issueForm.reportIssue
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueFormModal;
