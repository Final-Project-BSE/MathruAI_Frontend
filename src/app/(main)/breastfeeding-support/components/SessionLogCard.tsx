'use client';

import React, { useState } from 'react';
import { Clock, Plus, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BreastfeedingSessionResponseDto } from '@/app/api/breastfeeding/types';
import breastfeedingApi from '@/app/api/breastfeeding/api';
import SessionFormModal from './SessionFormModal';

interface SessionLogCardProps {
  sessions: BreastfeedingSessionResponseDto[];
  token: string | null;
  onRefresh: () => void;
}

const SIDE_LABELS: Record<string, string> = {
  LEFT: '⬅️ Left',
  RIGHT: '➡️ Right',
  BOTH: '↔️ Both',
};

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

const SessionLogCard: React.FC<SessionLogCardProps> = ({
  sessions,
  token,
  onRefresh,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] =
    useState<BreastfeedingSessionResponseDto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeletingId(id);
    try {
      await breastfeedingApi.deleteSession(token, id);
      onRefresh();
    } catch {
      setError('Failed to delete session. Please try again.');
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
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#d04f51]" />
          <h2 className="text-lg font-semibold text-[#d04f51]">
            Feeding Sessions
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
          Log Session
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#f3c7c8] bg-[#fff5f5] px-4 py-3 text-sm text-[#7a2d2f]">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xl text-[#d04f51] hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#f3c7c8] bg-[#fff5f5] p-8 text-center">
          <Clock className="mb-3 h-12 w-12 text-[#d04f51] opacity-40" />
          <p className="text-sm font-semibold text-[#5f3a3b]">
            No feeding sessions logged yet
          </p>
          <p className="mt-1 text-xs text-[#8a4b4c]">
            Tap "Log Session" to record your first breastfeeding session
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
                {/* Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Side Badge */}
                    <span
                      className="rounded-full border px-3 py-1 text-xs font-semibold text-[#5f3a3b]"
                      style={{
                        backgroundColor:
                          SIDE_COLORS[session.side] || '#fff5f5',
                        borderColor:
                          SIDE_BORDER[session.side] || '#f3c7c8',
                      }}
                    >
                      {SIDE_LABELS[session.side] || session.side}
                    </span>

                    {/* Date & Time */}
                    <div>
                      <p className="text-sm font-semibold text-[#5f3a3b]">
                        {feedDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-[#8a4b4c]">
                        {feedDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Right side actions */}
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[#f3d6d7] bg-[#fffafa] px-3 py-1 text-xs font-medium text-[#d04f51]">
                      {session.durationMinutes} min
                    </span>

                    {session.milkAmountMl > 0 && (
                      <span className="rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1 text-xs font-medium text-green-700">
                        {session.milkAmountMl} ml
                      </span>
                    )}

                    <button
                      onClick={() => handleEdit(session)}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5] hover:text-[#d04f51]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(session.id)}
                      disabled={deletingId === session.id}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5] hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => toggleExpand(session.id)}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5]"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Notes */}
                {isExpanded && (
                  <div className="mt-3 rounded-xl border border-[#f3d6d7] bg-[#fffafa] p-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#7a4a4b]">
                      Notes
                    </p>
                    <p className="text-sm leading-relaxed text-[#5f3a3b]">
                      {session.notes || 'No notes added.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
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