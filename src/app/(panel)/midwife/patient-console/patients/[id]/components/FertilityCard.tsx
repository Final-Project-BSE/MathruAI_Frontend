import type { FertilityResponseDto } from "@/app/api/midwife-patient/types";
import { formatDate } from "./lib/utils";

type FertilityCardProps = {
  fertility: FertilityResponseDto | null;
};

export default function FertilityCard({ fertility }: FertilityCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h2 className="mb-4 text-lg font-semibold">Fertility Data</h2>

      {!fertility ? (
        <div className="text-sm text-zinc-500">No fertility data available.</div>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Fertile window</span>
            <span className="text-right">
              {formatDate(fertility.fertileWindowStart)} -{" "}
              {formatDate(fertility.fertileWindowEnd)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Ovulation date</span>
            <span className="text-right">{formatDate(fertility.ovulationDate)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Next period date</span>
            <span className="text-right">{formatDate(fertility.nextPeriodDate)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Pregnancy test day</span>
            <span className="text-right">{formatDate(fertility.pregnancyTestDay)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Safe range 1</span>
            <span className="text-right">
              {formatDate(fertility.safeStart1)} - {formatDate(fertility.safeEnd1)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Safe range 2</span>
            <span className="text-right">
              {formatDate(fertility.safeStart2)} - {formatDate(fertility.safeEnd2)}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}