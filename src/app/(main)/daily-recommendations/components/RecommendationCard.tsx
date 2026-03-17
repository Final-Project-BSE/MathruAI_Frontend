'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  RefreshCw,
  User,
  Settings,
  CheckCircle2,
} from 'lucide-react';
import type {
  RecommendationData,
  ChecklistItem,
} from '../../../api/dailyrecommendation/types';

interface RecommendationCardProps {
  recommendation: RecommendationData | null;
  onRefresh: () => void;
  onSettingsClick: () => void;
  loading: boolean;
  preferences?: string;
  userId: number | null;
  token: string | null;
  onSaveChecklist: (payload: {
    date: string;
    items: ChecklistItem[];
  }) => Promise<void>;
}

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

  return raw
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !isLikelyIntro(s));
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
    return `dailyrec:${userId}:${recDate}:${recTextSig}`;
  }, [userId, recDate, recTextSig]);

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!recommendation || !userId) return;

    const serverMap: Record<string, boolean> = {};
    (recommendation.checklist || []).forEach((it) => {
      serverMap[it.id] = !!it.completed;
    });

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
        // ignore local storage parse issues
      }
    }

    setChecked(serverMap);
  }, [recommendation?.date, recommendation?.recommendation, userId, storageKey, recommendation]);

  useEffect(() => {
    setChecked((prev) => {
      const allowed = new Set(itemIds);
      const next: Record<string, boolean> = {};
      for (const [k, v] of Object.entries(prev)) {
        if (allowed.has(k)) next[k] = v;
      }
      return next;
    });
  }, [itemIds]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, []);

  const completedCount = useMemo(() => {
    return itemIds.reduce((acc, id) => acc + (checked[id] ? 1 : 0), 0);
  }, [itemIds, checked]);

  const allDone = itemIds.length > 0 && completedCount === itemIds.length;

  const saveNow = async (nextChecked: Record<string, boolean>) => {
    if (!recommendation || !userId || !token || !items.length) return;

    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextChecked));
      } catch {
        // ignore local storage write issues
      }
    }

    const payloadItems: ChecklistItem[] = items.map((text, idx) => {
      const id = itemIds[idx];
      return {
        id,
        text,
        completed: !!nextChecked[id],
      };
    });

    try {
      await onSaveChecklist({ date: recDate, items: payloadItems });
    } catch {
      // optionally add toast handling later
    }
  };

  const scheduleSave = (nextChecked: Record<string, boolean>) => {
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }

    saveTimer.current = window.setTimeout(() => {
      void saveNow(nextChecked);
    }, 250);
  };

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      scheduleSave(next);
      return next;
    });
  };

  const markAllDone = () => {
    const next: Record<string, boolean> = {};
    itemIds.forEach((id) => {
      next[id] = true;
    });
    setChecked(next);
    scheduleSave(next);
  };

  const resetChecklist = () => {
    const next: Record<string, boolean> = {};
    setChecked(next);
    scheduleSave(next);
  };

  return (
    <Card className="border border-[#d04f51]/15 bg-white shadow-sm">
      <CardHeader className="border-b border-[#d04f51]/10 pb-4">
        <CardTitle className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Today&apos;s Recommendation
              </h3>
              <p className="text-xs text-gray-500">{todayPretty}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onSettingsClick}
              variant="outline"
              size="sm"
              className="border-[#d04f51]/25 bg-white text-[#d04f51] hover:bg-[#d04f51]/5"
            >
              <Settings className="mr-2 h-4 w-4" />
              Update Your Data
            </Button>

            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="border-[#d04f51]/25 bg-white text-red-500 hover:bg-red-200"
              disabled={loading}
              title="Regenerate / Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {!recommendation ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#d04f51]/20 bg-[#d04f51]/5 px-6 text-center">
            <div>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Sparkles className="h-7 w-7 text-[#d04f51]/60" />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                No recommendation available yet
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Refresh to generate today&apos;s personalized guidance.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-[#d04f51]/15 bg-[#d04f51]/5 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      allDone ? 'text-green-600' : 'text-green-600'
                    }`}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {completedCount}/{itemIds.length} completed
                  </p>
                  <p className="text-xs text-gray-500">
                    Checklist saved for {recDate}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={markAllDone}
                  variant="outline"
                  size="sm"
                  className="border-[#d04f51]/25 bg-white text-green-600 hover:bg-green-200"
                  disabled={itemIds.length === 0}
                >
                  Mark all done
                </Button>
                <Button
                  onClick={resetChecklist}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 bg-white text-red-700 hover:bg-red-200"
                  disabled={itemIds.length === 0}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d04f51]/15 bg-white p-5">
              {items.length === 0 ? (
                <p className="text-sm leading-7 text-gray-700">
                  {recommendation.recommendation}
                </p>
              ) : (
                <ul className="space-y-3">
                  {items.map((item, idx) => {
                    const id = itemIds[idx];
                    const done = !!checked[id];

                    return (
                      <li
                        key={id}
                        className={`flex items-start gap-3 rounded-xl border p-4 transition ${
                          done
                            ? 'border-[#d04f51]/20 bg-[#d04f51]/5'
                            : 'border-[#d04f51]/10 bg-white hover:bg-[#d04f51]/[0.03]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleItem(id)}
                          className="mt-1 h-5 w-5 accent-green-600"
                        />

                        <span
                          className={`text-sm leading-6 text-gray-800 ${
                            done ? 'opacity-70 line-through' : ''
                          }`}
                        >
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {preferences && (
              <div className="flex items-start gap-3 rounded-2xl border border-[#d04f51]/15 bg-[#d04f51]/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <User className="h-5 w-5 text-[#d04f51]" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Personalized for you
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {preferences}
                  </p>
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