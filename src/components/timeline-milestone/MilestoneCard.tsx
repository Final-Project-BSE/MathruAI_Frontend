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
      className="animate-fadeSlideUp"
      style={{ animationDuration: "500ms", animationFillMode: "both" }}
    >
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/30">
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
          className="relative backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.65), ${data.color}15)`,
          }}
        >
          <div className="flex flex-col lg:flex-row gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center justify-center lg:w-[280px] shrink-0">
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

            <div className="flex-1 min-w-0 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: trimesterInfo.color }}
                >
                  {translated.trimesterLabel}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 text-gray-700 border border-gray-200">
                  {translated.week} {data.week} · {translated.month}{" "}
                  {data.month.toFixed(1)}
                </span>

                <span
                  className="px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    borderColor: data.color,
                    color: data.color,
                    background: `${data.color}10`,
                  }}
                >
                  {translated.stage}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {translated.title}
              </h2>

              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2.5 flex items-center gap-1.5">
                  {translated.keyDevelopments}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {translated.developments.map((dev, i) => {
                    const Icon = DEV_ICONS[i % DEV_ICONS.length];

                    return (
                      <div
                        key={`${data.week}-${i}`}
                        className="flex items-start gap-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 px-3 py-2.5 text-sm text-gray-700 shadow-sm"
                      >
                        <Icon
                          className="h-4 w-4 mt-0.5 shrink-0"
                          style={{ color: data.color }}
                        />

                        <span>{dev}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                    <Bone className="h-3.5 w-3.5 text-orange-500" />{" "}
                    {translated.bodyGrowthLabel}
                  </h4>

                  <p className="text-sm text-gray-700">
                    {translated.bodyGrowth}
                  </p>
                </div>

                <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-purple-500" />{" "}
                    {translated.hairSkin}
                  </h4>

                  <p className="text-sm text-gray-700">
                    {translated.hairGrowth}
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3 rounded-2xl p-4 border"
                style={{
                  background: `${data.color}08`,
                  borderColor: `${data.color}30`,
                }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full shrink-0"
                  style={{ background: `${data.color}20`, color: data.color }}
                >
                  <Info className="h-4 w-4" />
                </div>

                <div>
                  <p
                    className="text-xs font-bold mb-0.5"
                    style={{ color: data.color }}
                  >
                    {translated.didYouKnow}
                  </p>

                  <p className="text-sm text-gray-600">
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