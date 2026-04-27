"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Baby, Ruler, Weight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FETAL_DATA,
  TRIMESTER_RANGES,
} from "@/components/timeline-milestone/fetal-data";

type TimelineMilestoneSummaryCardProps = {
  pregnancyWeek?: number;
  daysLeft?: number;
};

export default function TimelineMilestoneSummaryCard({
  pregnancyWeek,
  daysLeft,
}: TimelineMilestoneSummaryCardProps) {
  const safeWeek = Math.max(1, Math.min(pregnancyWeek ?? 1, 41));

  const weekData =
    FETAL_DATA.find((item) => item.week === safeWeek) ?? FETAL_DATA[0];

  const trimesterInfo = TRIMESTER_RANGES[weekData.trimester - 1];

  const mainDevelopment =
    weekData.developments?.[0] ?? "Your baby is continuing to develop.";

  return (
    <Card className="overflow-hidden border-[#d04f51]/20 bg-white shadow-sm">
      <CardHeader className="">
        <CardTitle className="text-base font-semibold text-[#d04f51]">
          Pregnancy Timeline & Milestones
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-[150px_1fr]">
          <div className="relative h-[150px] overflow-hidden rounded-2xl bg-[#d04f51]/10">
            {weekData.image ? (
              <Image
                src={weekData.image}
                alt={`Week ${weekData.week} fetal development`}
                fill
                className="object-cover"
                sizes="150px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Baby className="h-14 w-14 text-[#d04f51]" />
              </div>
            )}

            <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-[#d04f51] shadow-sm">
              Week {weekData.week}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div
                className="mb-2 inline-flex rounded-full px-3 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: trimesterInfo.color }}
              >
                {trimesterInfo.label}
              </div>

              <h3 className="text-md font-bold text-gray-900">
                {weekData.title}
              </h3>

              <p className="text-xs text-gray-600">
                {mainDevelopment}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#d04f51]/20 bg-[#d04f51]/5 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <Ruler className="h-3.5 w-3.5 text-[#d04f51]" />
                  Size
                </div>
                <div className="text-xs font-semibold text-gray-900">
                  {weekData.sizeComparison}
                </div>
              </div>

              <div className="rounded-xl border border-[#d04f51]/20 bg-[#d04f51]/5 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <Weight className="h-3.5 w-3.5 text-[#d04f51]" />
                  Weight
                </div>
                <div className="text-xs font-semibold text-gray-900">
                  {weekData.weightGrams
                    ? weekData.weightGrams >= 1000
                      ? `${(weekData.weightGrams / 1000).toFixed(1)} kg`
                      : `${weekData.weightGrams} g`
                    : "—"}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#d04f51]/10 p-3 text-xs text-[#d04f51]">
              Estimated days left:{" "}
              <span className="font-semibold">{daysLeft ?? "—"}</span>
            </div>

            <Link
              href="/timeline-milestone"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#d04f51] hover:underline"
            >
              View full timeline
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}