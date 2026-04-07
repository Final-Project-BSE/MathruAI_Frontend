import React from "react";
import { ArrowUpRightIcon, CoinSymbol } from "./icons";

export type AssetCardProps = {
  name: string;
  label: string;
  rate: string;
  changeType: "up" | "down";
  coinBg: string;
};

export default function AssetCard({
  name,
  label,
  rate,
  changeType,
  coinBg,
}: AssetCardProps) {
  return (
    <div className="relative w-full min-w-0 overflow-hidden rounded-[14px] border border-white/8 bg-white/5 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-sm sm:p-3.5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${coinBg} shadow-inner sm:h-8 sm:w-8`}
          >
            <CoinSymbol name={name} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[9px] text-white/45 sm:text-[10px]">
              {label}
            </p>
            <h3 className="truncate text-[13px] font-medium leading-tight text-white/80 sm:text-[14px]">
              {name}
            </h3>
          </div>
        </div>

        <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/75 transition hover:bg-white/[0.07] sm:h-6 sm:w-6">
          <ArrowUpRightIcon />
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-[9px] text-white/45 sm:text-[10px]">Count</p>
        <div className="text-[18px] font-medium leading-none tracking-tight text-white/80 sm:text-[20px] xl:text-[22px]">
          {rate}
        </div>
      </div>
    </div>
  );
}