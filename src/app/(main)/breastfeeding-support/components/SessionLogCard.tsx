'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Plus, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/common/useLanguage';
import { translateText } from '@/components/common/translateText';
import type { BreastfeedingSessionResponseDto } from '@/app/api/breastfeeding/types';
import breastfeedingApi from '@/app/api/breastfeeding/api';
import SessionFormModal from './SessionFormModal';

interface SessionLogCardProps {
  sessions: BreastfeedingSessionResponseDto[];
  token: string | null;
  onRefresh: () => void;
}

const SIDE_COLORS: Record<string, string> = {
  LEFT: '#fff5f5',
  RIGHT: '#fffbeb',
  BOTH: '#f0fdf4',
};

const SIDE_BORDER: Record<string, string> = {
  LEFT: '#f3c7c8',
  RIGHT: '#fde68a',
  BOTH: '#bbf7d0',
};

const LOCALE_BY_LANGUAGE = {
  en: 'en-US',
  si: 'si-LK',
  ta: 'ta-LK',
} as const;

const SessionLogCard: React.FC<SessionLogCardProps> = ({
  sessions,
  token,
  onRefresh,
}) => {
  const { language, t } = useLanguage();
  const locale = LOCALE_BY_LANGUAGE[language];

  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] =
    useState<BreastfeedingSessionResponseDto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [translatedNotes, setTranslatedNotes] = useState<Record<string, string>>({});

  const noteItems = useMemo(
    () =>
      sessions
        .filter((session) => session.notes?.trim())
        .map((session) => ({
          id: session.id,
          value: session.notes.trim(),
        })),
    [sessions]
  );

  useEffect(() => {
    let active = true;

    const translateNotes = async () => {
      if (language === 'en' || noteItems.length === 0) {
        setTranslatedNotes({});
        return;
      }

      const entries = await Promise.all(
        noteItems.map(async (item) => [
          item.id,
          await translateText(item.value, language),
        ] as const)
      );

      if (active) {
        setTranslatedNotes(Object.fromEntries(entries));
      }
    };

    translateNotes();

    return () => {
      active = false;
    };
  }, [language, noteItems]);

  const getSessionNotes = (session: BreastfeedingSessionResponseDto) => {
    if (!session.notes?.trim()) return t.breastfeeding.sessions.noNotes;
    return translatedNotes[session.id] || session.notes;
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeletingId(id);
    try {
      await breastfeedingApi.deleteSession(token, id);
      onRefresh();
    } catch {
      setError(t.breastfeeding.sessions.failedDelete);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (session: BreastfeedingSessionResponseDto) => {
    setEditingSession(session);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSession(null);
  };

  const handleSaved = () => {
    handleModalClose();
    onRefresh();
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#d04f51]" />
          <h2 className="text-lg font-semibold text-[#d04f51]">
            {t.breastfeeding.sessions.title}
          </h2>
          <span className="rounded-full border border-[#f3c7c8] bg-[#fff5f5] px-2.5 py-0.5 text-xs font-semibold text-[#d04f51]">
            {sessions.length}
          </span>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#d04f51] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b94345] shadow-[0_10px_25px_rgba(208,79,81,0.28)]"
        >
          <Plus className="h-4 w-4" />
          {t.breastfeeding.sessions.logSession}
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

      {sessions.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#f3c7c8] bg-[#fff5f5] p-8 text-center">
          <Clock className="mb-3 h-12 w-12 text-[#d04f51] opacity-40" />
          <p className="text-sm font-semibold text-[#5f3a3b]">
            {t.breastfeeding.sessions.noSessionsTitle}
          </p>
          <p className="mt-1 text-xs text-[#8a4b4c]">
            {t.breastfeeding.sessions.noSessionsDescription}
          </p>
        </div>
      ) : (
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {sessions.map((session) => {
            const isExpanded = expandedId === session.id;
            const feedDate = new Date(session.feedingTime);

            return (
              <div
                key={session.id}
                className="group rounded-2xl border border-[#f1d2d3] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#d04f51] hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full border px-3 py-1 text-xs font-semibold text-[#5f3a3b]"
                      style={{
                        backgroundColor: SIDE_COLORS[session.side] || '#fff5f5',
                        borderColor: SIDE_BORDER[session.side] || '#f3c7c8',
                      }}
                    >
                      {t.breastfeeding.labels.sides[session.side] || session.side}
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-[#5f3a3b]">
                        {feedDate.toLocaleDateString(locale, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-[#8a4b4c]">
                        {feedDate.toLocaleTimeString(locale, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[#f3d6d7] bg-[#fffafa] px-3 py-1 text-xs font-medium text-[#d04f51]">
                      {t.breastfeeding.sessions.durationMin(session.durationMinutes)}
                    </span>

                    {session.milkAmountMl > 0 && (
                      <span className="rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1 text-xs font-medium text-green-700">
                        {t.breastfeeding.sessions.milkMl(session.milkAmountMl)}
                      </span>
                    )}

                    <button
                      onClick={() => handleEdit(session)}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5] hover:text-[#d04f51]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(session.id)}
                      disabled={deletingId === session.id}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5] hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => toggleExpand(session.id)}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5]"
                      aria-label="Expand"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 rounded-xl border border-[#f3d6d7] bg-[#fffafa] p-3">
                    <p className="mb-1 text-xs font-semibold text-[#d04f51]">
                      {t.breastfeeding.sessions.notes}
                    </p>
                    <p className="text-sm leading-relaxed text-[#5f3a3b]">
                      {getSessionNotes(session)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <SessionFormModal
          token={token}
          editingSession={editingSession}
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default SessionLogCard;
