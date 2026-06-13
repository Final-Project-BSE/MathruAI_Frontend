"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { TRIMESTER_RANGES, type FetalWeekData } from "./fetal-data";
import FetalIllustration from "./FetalIllustration";
import { Baby, Brain, Heart, Eye, Bone, Sparkles, Info } from "lucide-react";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface MilestoneCardProps {
  data: FetalWeekData;
  animKey: number;
}

const DEV_ICONS = [Brain, Heart, Eye, Bone, Sparkles, Baby];

export default function MilestoneCard({ data, animKey }: MilestoneCardProps) {
  const { language } = useLanguage();

  const trimesterInfo = TRIMESTER_RANGES[data.trimester - 1];

  const [translated, setTranslated] = useState({
    trimesterLabel: trimesterInfo.label,
    title: data.title,
    stage: data.stage,
    sizeComparison: data.sizeComparison,
    developments: data.developments,
    bodyGrowth: data.bodyGrowth,
    hairGrowth: data.hairGrowth,
    week: "Week",
    month: "Month",
    keyDevelopments: "Key Developments",
    bodyGrowthLabel: "Body Growth",
    hairSkin: "Hair & Skin",
    didYouKnow: "Did you know?",
    sizeOfA: "Size of a",
    of: "of",
    funFactPrefix: `At week ${data.week}, your baby is about the size of a`,
    andWeighsApproximately: "and weighs approximately",
    grams: "grams",
    kg: "kg",
  });

  useEffect(() => {
    let active = true;

    async function loadTranslations() {
      const [
        trimesterLabel,
        title,
        stage,
        sizeComparison,
        developments,
        bodyGrowth,
        hairGrowth,
        week,
        month,
        keyDevelopments,
        bodyGrowthLabel,
        hairSkin,
        didYouKnow,
        sizeOfA,
        of,
        funFactPrefix,
        andWeighsApproximately,
        grams,
        kg,
      ] = await Promise.all([
        translateText(trimesterInfo.label, language),
        translateText(data.title, language),
        translateText(data.stage, language),
        translateText(data.sizeComparison, language),
        Promise.all(
          data.developments.map((item) => translateText(item, language))
        ),
        translateText(data.bodyGrowth, language),
        translateText(data.hairGrowth, language),
        translateText("Week", language),
        translateText("Month", language),
        translateText("Key Developments", language),
        translateText("Body Growth", language),
        translateText("Hair & Skin", language),
        translateText("Did you know?", language),
        translateText("Size of a", language),
        translateText("of", language),
        translateText(
          `At week ${data.week}, your baby is about the size of a`,
          language
        ),
        translateText("and weighs approximately", language),
        translateText("grams", language),
        translateText("kg", language),
      ]);

      if (!active) return;

      setTranslated({
        trimesterLabel,
        title,
        stage,
        sizeComparison,
        developments,
        bodyGrowth,
        hairGrowth,
        week,
        month,
        keyDevelopments,
        bodyGrowthLabel,
        hairSkin,
        didYouKnow,
        sizeOfA,
        of,
        funFactPrefix,
        andWeighsApproximately,
        grams,
        kg,
      });
    }

    void loadTranslations();

    return () => {
      active = false;
    };
  }, [data, language, trimesterInfo.label]);

  const translatedWeight = useMemo(() => {
    if (!data.weightGrams) return "";

    if (data.weightGrams >= 1000) {
      return `${(data.weightGrams / 1000).toFixed(1)} ${translated.kg}`;
    }

    return `${data.weightGrams} ${translated.grams}`;
  }, [data.weightGrams, translated.grams, translated.kg]);

  return (
    <div
      key={animKey}
      className="w-full max-w-full min-w-0 animate-fadeSlideUp"
      style={{ animationDuration: "500ms", animationFillMode: "both" }}
    >
      <div className="relative w-full max-w-full min-w-0 overflow-hidden rounded-3xl border border-white/30 shadow-2xl">
        <div className="absolute inset-0">
          <Image
            src="/images/auth-bg.png"
            alt="Background"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
        </div>

        <div
          className="relative w-full max-w-full min-w-0 backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.65), ${data.color}15)`,
          }}
        >
          <div className="flex w-full max-w-full min-w-0 flex-col gap-6 p-4 sm:p-6 md:p-8 lg:flex-row">
            <div className="flex w-full max-w-full flex-col items-center justify-center lg:w-[280px] lg:shrink-0">
              <FetalIllustration
                week={data.week}
                emoji={data.emoji}
                sizeComparison={translated.sizeComparison}
                color={data.color}
                image={data.image}
                labels={{
                  sizeOfA: translated.sizeOfA,
                  week: translated.week,
                  of: translated.of,
                }}
              />
            </div>

            <div className="min-w-0 flex-1 space-y-5">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{ background: trimesterInfo.color }}
                >
                  {translated.trimesterLabel}
                </span>

                <span className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-bold text-gray-700">
                  {translated.week} {data.week} · {translated.month}{" "}
                  {data.month.toFixed(1)}
                </span>

                <span
                  className="rounded-full border px-3 py-1 text-xs font-bold"
                  style={{
                    borderColor: data.color,
                    color: data.color,
                    background: `${data.color}10`,
                  }}
                >
                  {translated.stage}
                </span>
              </div>

              <h2 className="break-words text-2xl font-extrabold leading-tight text-gray-900 md:text-3xl">
                {translated.title}
              </h2>

              <div className="min-w-0">
                <h3 className="mb-2.5 flex items-center gap-1.5 text-sm font-bold text-gray-700">
                  {translated.keyDevelopments}
                </h3>

                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                  {translated.developments.map((dev, i) => {
                    const Icon = DEV_ICONS[i % DEV_ICONS.length];

                    return (
                      <div
                        key={`${data.week}-${i}`}
                        className="flex min-w-0 items-start gap-2.5 rounded-xl border border-white/50 bg-white/60 px-3 py-2.5 text-sm text-gray-700 shadow-sm backdrop-blur-sm"
                      >
                        <Icon
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: data.color }}
                        />

                        <span className="min-w-0 break-words">{dev}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-xl border border-white/50 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
                  <h4 className="mb-1.5 flex items-center gap-1 text-xs font-bold text-gray-600">
                    <Bone className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                    {translated.bodyGrowthLabel}
                  </h4>

                  <p className="break-words text-sm text-gray-700">
                    {translated.bodyGrowth}
                  </p>
                </div>

                <div className="min-w-0 rounded-xl border border-white/50 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
                  <h4 className="mb-1.5 flex items-center gap-1 text-xs font-bold text-gray-600">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-purple-500" />
                    {translated.hairSkin}
                  </h4>

                  <p className="break-words text-sm text-gray-700">
                    {translated.hairGrowth}
                  </p>
                </div>
              </div>

              <div
                className="flex min-w-0 items-start gap-3 rounded-2xl border p-4"
                style={{
                  background: `${data.color}08`,
                  borderColor: `${data.color}30`,
                }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${data.color}20`, color: data.color }}
                >
                  <Info className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p
                    className="mb-0.5 text-xs font-bold"
                    style={{ color: data.color }}
                  >
                    {translated.didYouKnow}
                  </p>

                  <p className="break-words text-sm text-gray-600">
                    {translated.funFactPrefix}{" "}
                    {translated.sizeComparison.toLowerCase()}
                    {translatedWeight
                      ? ` ${translated.andWeighsApproximately} ${translatedWeight}`
                      : ""}
                    !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}