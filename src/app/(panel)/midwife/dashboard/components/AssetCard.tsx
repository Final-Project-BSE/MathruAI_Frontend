import React from "react";
import { CoinSymbol } from "./icons";

export type AssetCardProps = {
  name: string;
  label: string;
  rate: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  coinBg: string;
  isLoading?: boolean;
  error?: string;
};

export default function AssetCard({
  name,
  label,
  rate,
  change,
  changeType,
  coinBg,
  isLoading = false,
  error = "",
}: AssetCardProps) {
  const changeClass =
    changeType === "up"
      ? "text-emerald-300"
      : changeType === "down"
        ? "text-rose-300"
        : "text-white/45";

  return (
    <div className="relative w-full min-w-0 overflow-hidden rounded-[14px] border border-white/8 bg-white/5 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-sm sm:p-3.5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${coinBg} shadow-inner sm:h-7 sm:w-7`}
          >
            <CoinSymbol name={name} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[9px] text-white/45 sm:text-[10px]">
              {label}
            </p>
            <h3 className="truncate text-[11px] font-medium leading-tight text-white/80 sm:text-[12px]">
              {name}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[9px] text-white/45 sm:text-[10px]">Count</p>

        <div className="text-[18px] font-medium leading-none tracking-tight text-white/80 sm:text-[20px] xl:text-[22px]">
          {isLoading ? "..." : rate}
        </div>

        <p className={`truncate text-[9px] sm:text-[10px] ${changeClass}`}>
          {error ? "Some data failed to load" : isLoading ? "Loading..." : change}
        </p>
      </div>
    </div>
  );
}