import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, CheckCircle2, Circle } from 'lucide-react';
import type { HistoryItem } from '../../../api/dailyrecommendation/types';

interface HistorySectionProps {
  history: HistoryItem[];
  loading: boolean;
}

function checklistSignature(checklist: { id: string; completed: boolean; text: string }[]) {
  return checklist
    .map((c) => `${c.id}:${c.completed ? 1 : 0}`)
    .sort()
    .join('|');
}

const HistorySection: React.FC<HistorySectionProps> = ({ history, loading }) => {
  const seen = new Set<string>();

  return (
    <Card className="border border-[#f1d2d3] bg-white shadow-sm rounded-3xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-semibold text-[#d04f51]">
          <BookOpen className="mr-2 h-5 w-5 text-[#d04f51]" />
          Recent Recommendations
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="py-10 text-center text-[#8a4b4c]">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#f3d6d7] border-t-[#d04f51]" />
            <p className="text-sm font-medium">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-[#8a4b4c]">
            <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-40 text-[#d04f51]" />
            <p className="text-sm font-medium">No recommendation history yet</p>
          </div>
        ) : (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            {history.map((item, index) => {
              const checklist = item.checklist || [];
              const done = checklist.filter((c) => c.completed).length;
              const total = checklist.length;

              let showChecklist = total > 0;
              if (showChecklist) {
                const sig = checklistSignature(checklist);
                if (seen.has(sig)) showChecklist = false;
                else seen.add(sig);
              }

              return (
                <div
                  key={`${item.date}-${index}`}
                  className="group rounded-2xl border border-[#f1d2d3] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#d04f51] hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full border border-[#f3d6d7] bg-[#fff5f5] px-3 py-1 text-sm font-semibold text-[#d04f51]">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    <Calendar className="h-4 w-4 text-[#c58b8c] transition-colors group-hover:text-[#d04f51]" />
                  </div>

                  <p className="mb-3 text-sm leading-relaxed text-[#5f3a3b]">
                    {item.recommendation}
                  </p>

                  {showChecklist && (
                    <div className="mt-4 rounded-2xl border border-[#f3d6d7] bg-[#fffafa] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#7a4a4b]">
                          Checklist Progress
                        </p>
                        <p className="text-xs font-semibold text-[#d04f51]">
                          {done}/{total} completed
                        </p>
                      </div>

                      <ul className="space-y-2.5">
                        {checklist.map((c) => (
                          <li key={c.id} className="flex items-start gap-2.5">
                            {c.completed ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                            ) : (
                              <Circle className="mt-0.5 h-4 w-4 text-[#c9a3a4]" />
                            )}

                            <span
                              className={`text-xs leading-relaxed ${
                                c.completed
                                  ? 'text-[#7b6a6b] line-through opacity-70'
                                  : 'text-[#5f3a3b]'
                              }`}
                            >
                              {c.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistorySection;