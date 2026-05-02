'use client';

import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type {
  BreastfeedingTipResponseDto,
  TipCategory,
} from '@/app/api/breastfeeding/types';

interface TipsCardProps {
  tips: BreastfeedingTipResponseDto[];
  token: string | null;
  onRefresh: () => void;
}

const CATEGORY_LABELS: Record<TipCategory, string> = {
  LATCH_TECHNIQUE: '👶 Latch Technique',
  MILK_SUPPLY:     '🍼 Milk Supply',
  PAIN_RELIEF:     '💊 Pain Relief',
  NUTRITION:       '🥗 Nutrition',
  PUMPING:         '🔵 Pumping',
  GENERAL:         '💡 General',
};

const CATEGORY_COLORS: Record<TipCategory, { bg: string; border: string; text: string }> = {
  LATCH_TECHNIQUE: { bg: '#fff5f5', border: '#f3c7c8', text: '#d04f51' },
  MILK_SUPPLY:     { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  PAIN_RELIEF:     { bg: '#fdf4ff', border: '#e9d5ff', text: '#7c3aed' },
  NUTRITION:       { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  PUMPING:         { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  GENERAL:         { bg: '#fafafa', border: '#e5e7eb', text: '#374151' },
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as TipCategory[];

const TipsCard: React.FC<TipsCardProps> = ({ tips }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<TipCategory | 'ALL'>('ALL');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredTips = tips.filter((t) =>
    filterCategory === 'ALL' ? true : t.category === filterCategory
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#d04f51]" />
          <h2 className="text-lg font-semibold text-[#d04f51]">
            Expert Tips
          </h2>
          <span className="rounded-full border border-[#f3c7c8] bg-[#fff5f5] px-2.5 py-0.5 text-xs font-semibold text-[#d04f51]">
            {tips.length}
          </span>
        </div>

        {/* Read only badge */}
        <span className="rounded-full border border-[#f3d6d7] bg-[#fffafa] px-3 py-1 text-xs font-medium text-[#8a4b4c]">
          📖 Read Only
        </span>
      </div>

      {/* Category Filter */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {(['ALL', ...CATEGORIES] as const).map((cat) => {
          const color = cat === 'ALL' ? null : CATEGORY_COLORS[cat];
          const isSelected = filterCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200"
              style={
                isSelected && color
                  ? {
                      backgroundColor: color.text,
                      borderColor: color.text,
                      color: '#fff',
                    }
                  : isSelected
                  ? {
                      backgroundColor: '#d04f51',
                      borderColor: '#d04f51',
                      color: '#fff',
                    }
                  : color
                  ? {
                      backgroundColor: color.bg,
                      borderColor: color.border,
                      color: color.text,
                    }
                  : {
                      backgroundColor: '#fff5f5',
                      borderColor: '#f3c7c8',
                      color: '#d04f51',
                    }
              }
            >
              {cat === 'ALL' ? '🌟 All' : CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTips.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#f3c7c8] bg-[#fff5f5] p-8 text-center">
          <Lightbulb className="mb-3 h-12 w-12 text-[#d04f51] opacity-40" />
          <p className="text-sm font-semibold text-[#5f3a3b]">
            No tips available yet
          </p>
          <p className="mt-1 text-xs text-[#8a4b4c]">
            Tips added by your midwife will appear here
          </p>
        </div>
      ) : (
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {filteredTips.map((tip) => {
            const color =
              CATEGORY_COLORS[tip.category] || CATEGORY_COLORS.GENERAL;
            const isExpanded = expandedId === tip.id;

            return (
              <div
                key={tip.id}
                className="group rounded-2xl border border-[#f1d2d3] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#d04f51] hover:shadow-md"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    {/* Category Badge */}
                    <span
                      className="w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: color.bg,
                        borderColor: color.border,
                        color: color.text,
                      }}
                    >
                      {CATEGORY_LABELS[tip.category] || tip.category}
                    </span>

                    {/* Title */}
                    <p className="text-sm font-semibold text-[#5f3a3b]">
                      {tip.title}
                    </p>
                  </div>

                  {/* Expand Button Only */}
                  <button
                    onClick={() => toggleExpand(tip.id)}
                    className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5]"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-3 rounded-xl border border-[#f3d6d7] bg-[#fffafa] p-4">
                    <p className="text-sm leading-relaxed text-[#5f3a3b]">
                      {tip.content}
                    </p>
                    <p className="mt-3 text-xs text-[#8a4b4c]">
                      Added:{' '}
                      {new Date(tip.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TipsCard;