'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, User, Settings, CheckCircle2 } from 'lucide-react';
import type { RecommendationData, ChecklistItem } from '../../../api/dailyrecommendation/types';

interface RecommendationCardProps {
  recommendation: RecommendationData | null;
  onRefresh: () => void;
  onSettingsClick: () => void;
  loading: boolean;
  preferences?: string;
  userId: number | null;
  token: string | null;
  onSaveChecklist: (payload: { date: string; items: ChecklistItem[] }) => Promise<void>;
}

// --- helpers ---
function toISODate(d = new Date()): string {
  return d.toISOString().split('T')[0];
}

function isLikelyIntro(line: string): boolean {
  const l = line.trim().toLowerCase();
  const patterns = [
    /^hi\b/,
    /^hello\b/,
    /^hey\b/,
    /here(')?s\b.*recommendation/,
    /daily recommendation/,
    /tailored to your preferences/,
    /at \d+\s*weeks\b/,
  ];
  return l.endsWith(':') || patterns.some((p) => p.test(l));
}

function parseRecommendationToItems(text: string): string[] {
  const raw = (text || '').trim();
  if (!raw) return [];

  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length >= 2) {
    const cleaned = lines
      .map((l) => l.replace(/^(\-|\*|•|\u2022)\s+/, '').trim())
      .map((l) => l.replace(/^\d+[\).\s]+/, '').trim())
      .filter(Boolean)
      .filter((l) => !isLikelyIntro(l));
    if (cleaned.length >= 2) return cleaned;
  }

  const sentences = raw
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !isLikelyIntro(s));

  return sentences.length ? sentences : [];
}

function hashText(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onRefresh,
  onSettingsClick,
  loading,
  preferences,
  userId,
  token,
  onSaveChecklist,
}) => {
  const todayPretty = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const recDate = recommendation?.date || toISODate();

  const items = useMemo(() => {
    return parseRecommendationToItems(recommendation?.recommendation || '');
  }, [recommendation?.recommendation]);

  const itemIds = useMemo(() => items.map((t) => hashText(t)), [items]);

  const recTextSig = useMemo(() => {
    return hashText(recommendation?.recommendation || '');
  }, [recommendation?.recommendation]);

  const storageKey = useMemo(() => {
    if (!userId) return null;
    // storage key changes when recommendation text changes (same date regenerate)
    return `dailyrec:${userId}:${recDate}:${recTextSig}`;
  }, [userId, recDate, recTextSig]);

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // ✅ 1) Hydrate from backend (recommendation.checklist) when recommendation changes
  useEffect(() => {
    if (!recommendation || !userId) return;

    const serverMap: Record<string, boolean> = {};
    (recommendation.checklist || []).forEach((it) => {
      serverMap[it.id] = !!it.completed;
    });

    // if server has nothing but local has something, use local as fallback
    if (Object.keys(serverMap).length === 0 && storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            setChecked(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }
    }

    setChecked(serverMap);
  }, [recommendation?.date, recommendation?.recommendation, userId, storageKey]);

  // ✅ 2) Remove checked values that no longer exist
  useEffect(() => {
    setChecked((prev) => {
      const allowed = new Set(itemIds);
      const next: Record<string, boolean> = {};
      for (const [k, v] of Object.entries(prev)) {
        if (allowed.has(k)) next[k] = v;
      }
      return next;
    });
  }, [itemIds.join('|')]);

  const completedCount = useMemo(() => {
    return itemIds.reduce((acc, id) => acc + (checked[id] ? 1 : 0), 0);
  }, [itemIds, checked]);

  const allDone = itemIds.length > 0 && completedCount === itemIds.length;

  const toggleItem = async (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      void saveNow(next);
      return next;
    });
  };

  const markAllDone = () => {
    const next: Record<string, boolean> = {};
    itemIds.forEach((id) => (next[id] = true));
    setChecked(next);
    void saveNow(next);
  };

  const resetChecklist = () => {
    const next: Record<string, boolean> = {};
    setChecked(next);
    void saveNow(next);
  };
  // ✅ 3) Debounced save to backend + localstorage
  const saveTimer = useRef<number | null>(null);

  const saveNow = async (nextChecked: Record<string, boolean>) => {
    if (!recommendation || !userId || !token) return;
    if (!items.length) return;

    // localstorage backup (optional)
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextChecked));
      } catch {
        // ignore
      }
    }

    const payloadItems: ChecklistItem[] = items.map((text, idx) => {
      const id = itemIds[idx];
      return { id, text, completed: !!nextChecked[id] };
    });

    try {
      await onSaveChecklist({ date: recDate, items: payloadItems });
    } catch {
      // optional: show toast/error
    }
  };


  return (
    <Card className="shadow-md bg-white border-2 border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            Today's Recommendation
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onSettingsClick}
              variant="outline"
              size="sm"
              className="border-blue-300 hover:bg-blue-50"
            >
              <Settings className="h-4 w-4" /> Update Your Data
            </Button>

            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="border-purple-300 hover:bg-purple-50"
              disabled={loading}
              title="Regenerate / Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{todayPretty}</p>

        {!recommendation ? (
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No recommendation yet</p>
              <p className="text-sm text-gray-400 mt-2">Click refresh to get your daily recommendation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-xl border border-purple-100 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-5 h-5 ${allDone ? 'text-green-600' : 'text-purple-600'}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {completedCount}/{itemIds.length} completed
                  </p>
                  <p className="text-xs text-gray-500">Saved for {recDate} (user {userId})</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={markAllDone}
                  variant="outline"
                  size="sm"
                  className="border-green-300 hover:bg-green-50"
                  disabled={itemIds.length === 0}
                >
                  Mark all done
                </Button>
                <Button
                  onClick={resetChecklist}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50"
                  disabled={itemIds.length === 0}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              {items.length === 0 ? (
                <p className="text-gray-700">{recommendation.recommendation}</p>
              ) : (
                <ul className="space-y-3">
                  {items.map((item, idx) => {
                    const id = itemIds[idx];
                    const done = !!checked[id];
                    return (
                      <li
                        key={id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${done ? 'bg-green-50 border-green-200' : 'bg-white/70 border-purple-100 hover:bg-white'
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-5 w-5 accent-green-600"
                          checked={done}
                          onChange={() => void toggleItem(id)}
                        />
                        <span className={`text-gray-800 leading-relaxed ${done ? 'line-through opacity-70' : ''}`}>
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {preferences && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Personalized for you</p>
                  <p className="text-xs text-gray-600 mt-0.5">{preferences}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;