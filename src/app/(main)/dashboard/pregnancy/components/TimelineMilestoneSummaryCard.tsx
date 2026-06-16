"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Baby, Ruler, Weight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FETAL_DATA,
  TRIMESTER_RANGES,
} from "@/components/timeline-milestone/fetal-data";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";
import { useEffect, useState } from "react";

type TimelineMilestoneSummaryCardProps = {
  pregnancyWeek?: number;
  daysLeft?: number;
};

export default function TimelineMilestoneSummaryCard({
  pregnancyWeek,
  daysLeft,
}: TimelineMilestoneSummaryCardProps) {
  const { language, t } = useLanguage();

  const safeWeek = Math.max(1, Math.min(pregnancyWeek ?? 1, 41));

  const weekData =
    FETAL_DATA.find((item) => item.week === safeWeek) ?? FETAL_DATA[0];

  const trimesterInfo = TRIMESTER_RANGES[weekData.trimester - 1];

  const mainDevelopment =
    weekData.developments?.[0] ?? t.pregnancy.timeline.fallbackDevelopment;

  const [translatedTrimesterLabel, setTranslatedTrimesterLabel] = useState(
    trimesterInfo.label
  );
  const [translatedWeekTitle, setTranslatedWeekTitle] = useState(
    weekData.title
  );
  const [translatedMainDevelopment, setTranslatedMainDevelopment] =
    useState(mainDevelopment);
  const [translatedSizeComparison, setTranslatedSizeComparison] = useState(
    weekData.sizeComparison
  );

  useEffect(() => {
    let active = true;

    const translateDynamicTimelineData = async () => {
      if (language === "en") {
        setTranslatedTrimesterLabel(trimesterInfo.label);
        setTranslatedWeekTitle(weekData.title);
        setTranslatedMainDevelopment(mainDevelopment);
        setTranslatedSizeComparison(weekData.sizeComparison);
        return;
      }

      const [
        nextTrimesterLabel,
        nextWeekTitle,
        nextMainDevelopment,
        nextSizeComparison,
      ] = await Promise.all([
        translateText(trimesterInfo.label, language),
        translateText(weekData.title, language),
        translateText(mainDevelopment, language),
        translateText(weekData.sizeComparison, language),
      ]);

      if (!active) return;

      setTranslatedTrimesterLabel(nextTrimesterLabel);
      setTranslatedWeekTitle(nextWeekTitle);
      setTranslatedMainDevelopment(nextMainDevelopment);
      setTranslatedSizeComparison(nextSizeComparison);
    };

    void translateDynamicTimelineData();

    return () => {
      active = false;
    };
  }, [
    language,
    trimesterInfo.label,
    weekData.title,
    weekData.sizeComparison,
    mainDevelopment,
  ]);

  return (
    <Card className="overflow-hidden border-[#d04f51]/20 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[#d04f51]">
          {t.pregnancy.timeline.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-[150px_1fr]">
          <div className="relative h-[150px] overflow-hidden rounded-2xl bg-[#d04f51]/10">
            {weekData.image ? (
              <Image
                src={weekData.image}
                alt={`${t.pregnancy.timeline.week} ${weekData.week}`}
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
              {t.pregnancy.timeline.week} {weekData.week}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div
                className="mb-2 inline-flex rounded-full px-3 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: trimesterInfo.color }}
              >
                {translatedTrimesterLabel}
              </div>

              <h3 className="text-md font-bold text-gray-900">
                {translatedWeekTitle}
              </h3>

              <p className="text-xs text-gray-600">
                {translatedMainDevelopment}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#d04f51]/20 bg-[#d04f51]/5 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <Ruler className="h-3.5 w-3.5 text-[#d04f51]" />
                  {t.pregnancy.timeline.size}
                </div>

                <div className="text-xs font-semibold text-gray-900">
                  {translatedSizeComparison}
                </div>
              </div>

              <div className="rounded-xl border border-[#d04f51]/20 bg-[#d04f51]/5 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <Weight className="h-3.5 w-3.5 text-[#d04f51]" />
                  {t.pregnancy.timeline.weight}
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
              {t.pregnancy.timeline.estimatedDaysLeft}:{" "}
              <span className="font-semibold">{daysLeft ?? "—"}</span>
            </div>

            <Link
              href="/timeline-milestone"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#d04f51] hover:underline"
            >
              {t.pregnancy.timeline.viewFullTimeline}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}