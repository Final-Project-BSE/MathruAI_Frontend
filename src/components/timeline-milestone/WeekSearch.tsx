"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface WeekSearchProps {
  onSelectWeek: (week: number) => void;
  totalWeeks: number;
}

const PLACEHOLDERS = [
  'Search "Week 12"',
  'Search "3 months"',
  'Search "Week 28"',
  'Try "month 5"',
  'Search "20"',
];

export default function WeekSearch({
  onSelectWeek,
  totalWeeks,
}: WeekSearchProps) {
  const { language } = useLanguage();

  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [translatedPlaceholders, setTranslatedPlaceholders] =
    useState(PLACEHOLDERS);
  const [clearLabel, setClearLabel] = useState("Clear search");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadTranslations() {
      const [placeholders, translatedClearLabel] = await Promise.all([
        Promise.all(
          PLACEHOLDERS.map((placeholder) =>
            translateText(placeholder, language)
          )
        ),
        translateText("Clear search", language),
      ]);

      if (!active) return;

      setTranslatedPlaceholders(placeholders);
      setClearLabel(translatedClearLabel);
    }

    void loadTranslations();

    return () => {
      active = false;
    };
  }, [language]);

  const monthWords = useMemo(() => {
    return ["month", "months"];
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return;

    const monthMatch =
      trimmed.match(/(?:month\s*)?(\d+(?:\.\d+)?)\s*months?/i) ||
      trimmed.match(/month\s*(\d+(?:\.\d+)?)/i);

    if (monthMatch) {
      const month = parseFloat(monthMatch[1]);
      const approxWeek = Math.round(month * 4.33);
      const clamped = Math.max(1, Math.min(approxWeek, totalWeeks));

      onSelectWeek(clamped);
      return;
    }

    const translatedMonthMatch = monthWords.some((word) =>
      trimmed.includes(word)
    )
      ? trimmed.match(/(\d+(?:\.\d+)?)/)
      : null;

    if (translatedMonthMatch) {
      const month = parseFloat(translatedMonthMatch[1]);
      const approxWeek = Math.round(month * 4.33);
      const clamped = Math.max(1, Math.min(approxWeek, totalWeeks));

      onSelectWeek(clamped);
      return;
    }

    const weekMatch = trimmed.match(/(?:week\s*)?(\d+)/i);

    if (weekMatch) {
      const week = parseInt(weekMatch[1], 10);
      const clamped = Math.max(1, Math.min(week, totalWeeks));

      onSelectWeek(clamped);
    }
  };

  return (
    <div
      className={`
        relative flex items-center gap-2 rounded-2xl border px-4 py-3
        bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300
        ${
          isFocused
            ? "border-[#d04f51] shadow-pink-200/50 shadow-xs ring-1 ring-[#d04f51]"
            : "border-[#d04f51]"
        }
      `}
      style={{ maxWidth: 400 }}
    >
      <Search className="h-5 w-5 text-[#d04f51] shrink-0" />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch(query);
        }}
        placeholder={
          translatedPlaceholders[placeholderIdx] ?? PLACEHOLDERS[placeholderIdx]
        }
        className="flex-1 bg-transparent text-sm font-medium text-gray-800 placeholder:text-gray-400 outline-none"
        id="week-search-input"
      />

      {query && (
        <button
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          className="rounded-full p-1 text-gray-400 hover:bg-white hover:text-[#d04f51] transition"
          aria-label={clearLabel}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}