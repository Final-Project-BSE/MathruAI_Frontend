"use client";

import { Send, Sparkles, Loader2 } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isConnected: boolean;
  onTipClick: (tip: string) => void;
}

export default function ChatInput({
  inputMessage,
  onChange,
  onSubmit,
  isLoading,
  isConnected,
  onTipClick,
}: ChatInputProps) {
  const tips = [
    "How do I manage a high-risk pregnancy case?",
    "How to document a maternity case properly",
  ];

  return (
    <div className="shrink-0 border-t border-white/10 bg-[#070707]/95 px-3 py-3 backdrop-blur sm:px-5 sm:py-4">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-3 flex flex-wrap gap-2">
          {tips.map((tip) => (
            <button
              key={tip}
              onClick={() => onTipClick(tip)}
              disabled={isLoading || !isConnected}
              type="button"
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tip}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="relative min-w-0 flex-1">
            <textarea
              rows={1}
              value={inputMessage}
              onChange={(e) => onChange(e.target.value)}
              placeholder={
                isConnected
                  ? "Ask anything about pregnancy..."
                  : "Please wait, connecting..."
              }
              disabled={isLoading || !isConnected}
              className="min-h-[54px] max-h-40 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d04f51]/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#d04f51]/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Sparkles className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-white/25" />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim() || !isConnected}
            className="inline-flex h-[54px] w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#d04f51] px-5 text-sm font-medium text-white transition hover:bg-[#ba4547] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}