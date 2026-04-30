'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Loader2 } from 'lucide-react';
import type {
  BreastfeedingSessionResponseDto,
  BreastfeedingSessionRequestDto,
  FeedingSide,
} from '@/app/api/breastfeeding/types';
import breastfeedingApi from '@/app/api/breastfeeding/api';

interface SessionFormModalProps {
  token: string | null;
  editingSession: BreastfeedingSessionResponseDto | null;
  onClose: () => void;
  onSaved: () => void;
}

const SIDES: FeedingSide[] = ['LEFT', 'RIGHT', 'BOTH'];

const SessionFormModal: React.FC<SessionFormModalProps> = ({
  token,
  editingSession,
  onClose,
  onSaved,
}) => {
  const [feedingTime, setFeedingTime] = useState('');
  const [side, setSide] = useState<FeedingSide>('LEFT');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [milkAmountMl, setMilkAmountMl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingSession) {
      const dt = new Date(editingSession.feedingTime);
      const localISO = new Date(
        dt.getTime() - dt.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      setFeedingTime(localISO);
      setSide(editingSession.side);
      setDurationMinutes(String(editingSession.durationMinutes || ''));
      setMilkAmountMl(String(editingSession.milkAmountMl || ''));
      setNotes(editingSession.notes || '');
    } else {
      const now = new Date();
      const localISO = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      setFeedingTime(localISO);
    }
  }, [editingSession]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!feedingTime) {
      newErrors.feedingTime = 'Feeding time is required.';
    }
    if (!durationMinutes || Number(durationMinutes) <= 0) {
      newErrors.durationMinutes = 'Please enter a valid duration.';
    }
    if (milkAmountMl && Number(milkAmountMl) < 0) {
      newErrors.milkAmountMl = 'Milk amount cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!token || !validate()) return;

    setLoading(true);
    setError(null);

    try {
      const payload: BreastfeedingSessionRequestDto = {
        feedingTime: new Date(feedingTime).toISOString().slice(0, 19), // strips .000Z
        side,
        durationMinutes: Number(durationMinutes),
        milkAmountMl: milkAmountMl ? Number(milkAmountMl) : 0,
        notes,
      };

      if (editingSession) {
        await breastfeedingApi.updateSession(token, editingSession.id, payload);
      } else {
        await breastfeedingApi.createSession(token, payload);
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save session. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-lg rounded-3xl border-0 bg-white shadow-[0_20px_60px_rgba(208,79,81,0.18)]">
        <CardHeader className="border-b border-[#f3d6d7] pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#d04f51]">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-semibold">
                {editingSession ? 'Edit Session' : 'Log Feeding Session'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-[#8a4b4c] transition-colors hover:text-[#d04f51]"
            >
              ×
            </button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-[#f3c7c8] bg-[#fff5f5] px-4 py-3 text-sm text-[#7a2d2f]">
              {error}
            </div>
          )}

          {/* Feeding Time */}
          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              Feeding Time <span className="text-[#d04f51]">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={feedingTime}
              onChange={(e) => setFeedingTime(e.target.value)}
              className={`mt-1 rounded-xl border-[#f3d6d7] focus:border-[#d04f51] focus:ring-[#d04f51] ${
                errors.feedingTime ? 'border-red-400' : ''
              }`}
            />
            {errors.feedingTime && (
              <p className="mt-1 text-xs text-red-500">{errors.feedingTime}</p>
            )}
          </div>

          {/* Side Selection */}
          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              Feeding Side <span className="text-[#d04f51]">*</span>
            </Label>
            <div className="mt-2 flex gap-3">
              {SIDES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSide(s)}
                  className={[
                    'flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all duration-200',
                    side === s
                      ? 'border-[#d04f51] bg-[#d04f51] text-white shadow-[0_8px_20px_rgba(208,79,81,0.25)]'
                      : 'border-[#f3d6d7] bg-white text-[#5f3a3b] hover:bg-[#fff5f5]',
                  ].join(' ')}
                >
                  {s === 'LEFT' ? '⬅️ Left' : s === 'RIGHT' ? '➡️ Right' : '↔️ Both'}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              Duration (minutes) <span className="text-[#d04f51]">*</span>
            </Label>
            <Input
              type="number"
              min="1"
              max="120"
              placeholder="e.g. 15"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className={`mt-1 rounded-xl border-[#f3d6d7] focus:border-[#d04f51] focus:ring-[#d04f51] ${
                errors.durationMinutes ? 'border-red-400' : ''
              }`}
            />
            {errors.durationMinutes && (
              <p className="mt-1 text-xs text-red-500">
                {errors.durationMinutes}
              </p>
            )}
          </div>

          {/* Milk Amount */}
          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              Milk Amount (ml){' '}
              <span className="text-xs font-normal text-[#8a4b4c]">
                — optional, for pumping
              </span>
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 120"
              value={milkAmountMl}
              onChange={(e) => setMilkAmountMl(e.target.value)}
              className={`mt-1 rounded-xl border-[#f3d6d7] focus:border-[#d04f51] focus:ring-[#d04f51] ${
                errors.milkAmountMl ? 'border-red-400' : ''
              }`}
            />
            {errors.milkAmountMl && (
              <p className="mt-1 text-xs text-red-500">{errors.milkAmountMl}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm font-medium text-[#5f3a3b]">
              Notes{' '}
              <span className="text-xs font-normal text-[#8a4b4c]">
                — optional
              </span>
            </Label>
            <Textarea
              rows={3}
              placeholder="e.g. Baby fed well, no discomfort..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 resize-none rounded-xl border-[#f3d6d7] focus:border-[#d04f51] focus:ring-[#d04f51]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl border-[#f3d6d7] text-[#5f3a3b] hover:bg-[#fff5f5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-xl bg-[#d04f51] text-white hover:bg-[#b94345] shadow-[0_10px_25px_rgba(208,79,81,0.28)]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingSession ? (
                'Update Session'
              ) : (
                'Log Session'
              )}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default SessionFormModal;