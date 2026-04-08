"use client";

import { AlertCircle, Baby, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ChatHeaderProps {
  isConnected: boolean;
  connectionError: string | null;
  onRetry: () => void;
  canRetry: boolean;
}

export default function ChatHeader({
  isConnected,
  connectionError,
  onRetry,
  canRetry,
}: ChatHeaderProps) {
  return (
    <div className="shrink-0 border-b border-white/10 bg-[#070707]/95 px-4 py-2 backdrop-blur sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#d04f51]/15 shadow-[0_0_30px_rgba(208,79,81,0.18)] sm:h-10 sm:w-10">
            <Baby className="h-4 w-4 text-[#ff7b7d]" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xs font-semibold tracking-tight text-white sm:text-sm">
              HelloBump
            </h1>
            <p className="text-xs text-white/45">
              Pregnancy assistant
            </p>
          </div>
        </div>

        <div
          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-2 py-1 text-xs font-medium ${
            isConnected
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-300"
          }`}
        >
          {isConnected ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      {connectionError && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-100 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
            <span className="text-sm leading-6 text-red-200/95">
              {connectionError}
            </span>
          </div>

          <button
            onClick={onRetry}
            disabled={!canRetry}
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}