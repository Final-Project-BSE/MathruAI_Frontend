"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function SearchableSelect({
  label,
  value,
  options,
  placeholder,
  disabled,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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
      <label className="mb-2 block text-xs font-medium text-gray-300">
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
        className="w-full rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 placeholder:text-xs outline-none focus:border-[#d04f51] disabled:cursor-not-allowed disabled:opacity-50"
      />

      {open && !disabled ? (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-white/10 bg-zinc-950 shadow-2xl">
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
                className="block w-full border-b border-white/5 px-4 py-1 text-left text-xs text-gray-200 hover:bg-white/10"
              >
                {option}
              </button>
            ))
          ) : (
            <div className="px-4 py-1 text-xs text-gray-400">
              No matching results
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}