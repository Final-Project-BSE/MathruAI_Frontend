"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "./utils";

type Props = {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  theme?: "light" | "dark";
  noResultsLabel?: string;
};

export default function SearchableSelect({
  label,
  value,
  options,
  placeholder,
  disabled,
  onChange,
  theme = "dark",
  noResultsLabel = "No matching results",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const isLightTheme = theme === "light";

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((item) => item.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div ref={wrapperRef} className="relative">
      <label
        className={cn(
          "mb-2 block text-xs font-medium",
          isLightTheme ? "text-gray-900" : "text-gray-300"
        )}
      >
        {label}
      </label>

      <input
        type="text"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          const newValue = e.target.value;
          setQuery(newValue);
          onChange(newValue);
          setOpen(true);
        }}
        className={cn(
          "w-full rounded-md border px-4 py-2 text-xs outline-none disabled:cursor-not-allowed disabled:opacity-50",
          isLightTheme
            ? "border-gray-300 bg-white text-gray-900 placeholder:text-gray-800 focus:border-[#d04f51]"
            : "border-white/10 bg-black text-white placeholder:text-gray-500 focus:border-[#d04f51]"
        )}
      />

      {open && !disabled ? (
        <div
          className={cn(
            "absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-md border shadow-2xl",
            isLightTheme
              ? "border-gray-200 bg-white"
              : "border-white/10 bg-zinc-950"
          )}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setQuery(option);
                  onChange(option);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full border-b px-4 py-1 text-left text-xs",
                  isLightTheme
                    ? "border-gray-100 text-gray-800 hover:bg-gray-50"
                    : "border-white/5 text-gray-200 hover:bg-white/10"
                )}
              >
                {option}
              </button>
            ))
          ) : (
            <div
              className={cn(
                "px-4 py-1 text-xs",
                isLightTheme ? "text-gray-500" : "text-gray-400"
              )}
            >
              {noResultsLabel}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
