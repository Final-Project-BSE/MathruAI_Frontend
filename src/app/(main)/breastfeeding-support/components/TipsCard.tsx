'use client';

import React, { useState } from 'react';
import { Lightbulb, Plus, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type {
  BreastfeedingTipResponseDto,
  BreastfeedingTipRequestDto,
  TipCategory,
} from '@/app/api/breastfeeding/types';
import breastfeedingApi from '@/app/api/breastfeeding/api';

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

const TipsCard: React.FC<TipsCardProps> = ({ tips, token, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTip, setEditingTip] =
    useState<BreastfeedingTipResponseDto | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<TipCategory | 'ALL'>('ALL');

  // Form state
  const [category, setCategory] = useState<TipCategory>('GENERAL');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openAddForm = () => {
    setEditingTip(null);
    setCategory('GENERAL');
    setTitle('');
    setContent('');
    setActive(true);
    setFormErrors({});
    setShowForm(true);
  };

  const openEditForm = (tip: BreastfeedingTipResponseDto) => {
    setEditingTip(tip);
    setCategory(tip.category);
    setTitle(tip.title);
    setContent(tip.content);
    setActive(tip.active);
    setFormErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTip(null);
    setFormErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!content.trim()) newErrors.content = 'Content is required.';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!token || !validate()) return;
    setLoading(true);
    setError(null);

    try {
      const payload: BreastfeedingTipRequestDto = {
        category,
        title,
        content,
        active,
      };

      if (editingTip) {
        await breastfeedingApi.updateTip(token, editingTip.id, payload);
      } else {
        await breastfeedingApi.createTip(token, payload);
      }

      closeForm();
      onRefresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save tip. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeletingId(id);
    try {
      await breastfeedingApi.deleteTip(token, id);
      onRefresh();
    } catch {
      setError('Failed to delete tip. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

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

        <Button
          onClick={openAddForm}
          className="flex items-center gap-2 rounded-xl bg-[#d04f51] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b94345] shadow-[0_10px_25px_rgba(208,79,81,0.28)]"
        >
          <Plus className="h-4 w-4" />
          Add Tip
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

      {/* Inline Add / Edit Form */}
      {showForm && (
        <Card className="mb-6 rounded-3xl border border-[#f3d6d7] bg-[#fffafa] shadow-sm">
          <CardHeader className="border-b border-[#f3d6d7] pb-3">
            <CardTitle className="flex items-center justify-between text-base text-[#d04f51]">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                {editingTip ? 'Edit Tip' : 'Add New Tip'}
              </div>
              <button
                onClick={closeForm}
                className="text-2xl text-[#8a4b4c] transition-colors hover:text-[#d04f51]"
              >
                ×
              </button>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">

            {/* Category */}
            <div>
              <Label className="text-sm font-medium text-[#5f3a3b]">
                Category <span className="text-[#d04f51]">*</span>
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((cat) => {
                  const color = CATEGORY_COLORS[cat];
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className="rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200"
                      style={
                        isSelected
                          ? {
                              backgroundColor: color.text,
                              borderColor: color.text,
                              color: '#fff',
                            }
                          : {
                              backgroundColor: color.bg,
                              borderColor: color.border,
                              color: color.text,
                            }
                      }
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label className="text-sm font-medium text-[#5f3a3b]">
                Title <span className="text-[#d04f51]">*</span>
              </Label>
              <Input
                placeholder="Enter tip title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`mt-1 rounded-xl border-[#f3d6d7] focus:border-[#d04f51] focus:ring-[#d04f51] ${
                  formErrors.title ? 'border-red-400' : ''
                }`}
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <Label className="text-sm font-medium text-[#5f3a3b]">
                Content <span className="text-[#d04f51]">*</span>
              </Label>
              <Textarea
                rows={4}
                placeholder="Write the tip content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`mt-1 resize-none rounded-xl border-[#f3d6d7] focus:border-[#d04f51] focus:ring-[#d04f51] ${
                  formErrors.content ? 'border-red-400' : ''
                }`}
              />
              {formErrors.content && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.content}
                </p>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-[#f3d6d7] bg-white px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#5f3a3b]">Active</p>
                <p className="text-xs text-[#8a4b4c]">
                  Show this tip to users
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive((prev) => !prev)}
                className={[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                  active ? 'bg-[#d04f51]' : 'bg-gray-200',
                ].join(' ')}
              >
                <span
                  className={[
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
                    active ? 'translate-x-6' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <Button
                onClick={closeForm}
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
                ) : editingTip ? (
                  'Update Tip'
                ) : (
                  'Add Tip'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
            Tap "Add Tip" to share expert breastfeeding guidance
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

                    <p className="text-sm font-semibold text-[#5f3a3b]">
                      {tip.title}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    {!tip.active && (
                      <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        Inactive
                      </span>
                    )}

                    <button
                      onClick={() => openEditForm(tip)}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5] hover:text-[#d04f51]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(tip.id)}
                      disabled={deletingId === tip.id}
                      className="rounded-lg p-1.5 text-[#8a4b4c] transition-colors hover:bg-[#fff5f5] hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

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