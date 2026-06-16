"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Baby,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import apis from "../../../../api/dailyrecommendation/api";
import type {
  RecommendationData,
  UserData,
} from "../../../../api/dailyrecommendation/types";
import { useLanguage } from "@/components/common/useLanguage";
import { translateMany, translateText } from "@/components/common/translateText";

interface TodaysRecommendationProps {
  href?: string;
}

function isLikelyIntro(line: string): boolean {
  const l = line.trim().toLowerCase();

  const patterns = [
    /^hi\b/,
    /^hello\b/,
    /^hey\b/,
    /here(')?s\b.*recommendation/,
    /daily recommendation/,
    /tailored to your preferences/,
    /at \d+\s*weeks\b/,
  ];

  return l.endsWith(":") || patterns.some((p) => p.test(l));
}

function parseRecommendationToItems(text: string): string[] {
  const raw = (text || "").trim();
  if (!raw) return [];

  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length >= 2) {
    const cleaned = lines
      .map((l) => l.replace(/^(\-|\*|•|\u2022)\s+/, "").trim())
      .map((l) => l.replace(/^\d+[\).\s]+/, "").trim())
      .filter(Boolean)
      .filter((l) => !isLikelyIntro(l));

    if (cleaned.length >= 2) return cleaned;
  }

  return raw
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !isLikelyIntro(s));
}

function getCardTitleFromText(
  text: string,
  index: number,
  t: ReturnType<typeof useLanguage>["t"]
): string {
  const lower = text.toLowerCase();

  if (
    lower.includes("water") ||
    lower.includes("hydrate") ||
    lower.includes("hydration") ||
    lower.includes("drink")
  ) {
    return t.pregnancy.recommendation.hydrationGoal;
  }

  if (
    lower.includes("walk") ||
    lower.includes("stretch") ||
    lower.includes("exercise") ||
    lower.includes("activity") ||
    lower.includes("movement")
  ) {
    return t.pregnancy.recommendation.gentleActivity;
  }

  if (
    lower.includes("rest") ||
    lower.includes("sleep") ||
    lower.includes("nap") ||
    lower.includes("fatigue")
  ) {
    return t.pregnancy.recommendation.restReminder;
  }

  if (
    lower.includes("meal") ||
    lower.includes("food") ||
    lower.includes("snack") ||
    lower.includes("eat") ||
    lower.includes("nutrition")
  ) {
    return t.pregnancy.recommendation.nutritionFocus;
  }

  if (
    lower.includes("doctor") ||
    lower.includes("midwife") ||
    lower.includes("checkup") ||
    lower.includes("appointment")
  ) {
    return t.pregnancy.recommendation.careReminder;
  }

  return `${t.pregnancy.recommendation.recommendation} ${index + 1}`;
}

const TodaysRecommendation: React.FC<TodaysRecommendationProps> = ({
  href = "/dailyrecommendation",
}) => {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [recommendation, setRecommendation] =
    useState<RecommendationData | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [translatedPreviewItems, setTranslatedPreviewItems] = useState<
    string[]
  >([]);
  const [translatedRecommendationText, setTranslatedRecommendationText] =
    useState("");
  const [translatedError, setTranslatedError] = useState("");

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);

        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();

        const jwt = session?.user?.token;

        if (!jwt) {
          setError(t.pregnancy.recommendation.loginRequired);
          return;
        }

        setToken(jwt);

        let uid: number | null = null;

        try {
          const me = await apis.me(jwt);
          const raw = (me.user_id ?? me.id) as unknown;

          if (raw !== undefined && raw !== null) {
            const parsed =
              typeof raw === "number" ? raw : parseInt(String(raw), 10);

            if (!Number.isNaN(parsed)) uid = parsed;
          }
        } catch {
          uid = null;
        }

        if (!uid) {
          setError(t.pregnancy.recommendation.userIdFailed);
          return;
        }

        setUserId(uid);

        const [user, rec] = await Promise.all([
          apis.getUser(jwt, uid),
          apis.getTodayRecommendation(jwt, uid).catch(() => null),
        ]);

        setUserData(user);
        setRecommendation(rec);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : t.pregnancy.recommendation.loadFailed
        );
      } finally {
        setLoading(false);
      }
    };

    void initialize();
  }, [t]);

  const handleRefresh = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!token || !userId) {
      setError(t.pregnancy.recommendation.refreshAuthRequired);
      return;
    }

    try {
      setRefreshing(true);
      setError(null);

      const rec = await apis.refreshRecommendation(token, userId);
      setRecommendation(rec);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t.pregnancy.recommendation.refreshFailed
      );
    } finally {
      setRefreshing(false);
    }
  };

  const recommendationText = recommendation?.recommendation || "";

  const previewItems = useMemo(() => {
    const parsed = parseRecommendationToItems(recommendationText);
    return parsed.slice(0, 6);
  }, [recommendationText]);

  useEffect(() => {
    let active = true;

    const translateRecommendation = async () => {
      if (language === "en") {
        setTranslatedPreviewItems(previewItems);
        setTranslatedRecommendationText(recommendationText);
        return;
      }

      const [nextItems, nextFullText] = await Promise.all([
        translateMany(previewItems, language),
        translateText(recommendationText, language),
      ]);

      if (!active) return;

      setTranslatedPreviewItems(nextItems);
      setTranslatedRecommendationText(nextFullText);
    };

    void translateRecommendation();

    return () => {
      active = false;
    };
  }, [language, previewItems, recommendationText]);

  useEffect(() => {
    let active = true;

    const translateError = async () => {
      if (!error || language === "en") {
        setTranslatedError(error ?? "");
        return;
      }

      const translated = await translateText(error, language);

      if (active) {
        setTranslatedError(translated);
      }
    };

    void translateError();

    return () => {
      active = false;
    };
  }, [error, language]);

  const marqueeItems = useMemo(() => {
    if (translatedPreviewItems.length === 0) return [];
    return [...translatedPreviewItems, ...translatedPreviewItems];
  }, [translatedPreviewItems]);

  const completion = useMemo(() => {
    const checklist = recommendation?.checklist || [];
    const total = checklist.length;
    const done = checklist.filter((item) => item.completed).length;

    return { done, total };
  }, [recommendation]);

  const todayLabel = useMemo(() => {
    const locale =
      language === "si" ? "si-LK" : language === "ta" ? "ta-LK" : "en-US";

    return new Date().toLocaleDateString(locale, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [language]);

  const goToFullPage = () => {
    router.push(href);
  };

  if (loading) {
    return (
      <Card className="border-[#d04f51]/20 bg-white shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#d04f51]">
            {t.pregnancy.recommendation.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#d04f51]/20 bg-[#d04f51]/5">
            <div className="text-center">
              <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-[#d04f51]" />
              <p className="text-sm font-medium text-[#7a2d2f]">
                {t.pregnancy.recommendation.loading}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-[#d04f51]/20 bg-white shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#d04f51]">
            {t.pregnancy.recommendation.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-2xl border border-[#f3c7c8] bg-[#fff5f5] p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-[#d04f51]" />
              <div>
                <p className="text-sm font-semibold text-[#7a2d2f]">
                  {t.pregnancy.recommendation.unableToLoad}
                </p>
                <p className="mt-1 text-sm text-[#8a4b4c]">
                  {translatedError || error}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes recommendation-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .recommendation-marquee-track {
          width: max-content;
          animation: recommendation-marquee 24s linear infinite;
        }

        .recommendation-marquee-wrapper:hover .recommendation-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <Card
        onClick={goToFullPage}
        className="cursor-pointer border-[#d04f51]/20 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:col-span-2"
      >
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-[#d04f51]">
                {t.pregnancy.recommendation.title}
              </CardTitle>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-[#d04f51]" />
                  {todayLabel}
                </span>

                {userData?.pregnancy_week ? (
                  <span className="flex items-center gap-1.5">
                    <Baby className="h-4 w-4 text-[#d04f51]" />
                    {t.pregnancy.recommendation.week}{" "}
                    {userData.pregnancy_week}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-full border border-[#d04f51]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#d04f51] transition hover:bg-[#d04f51]/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
                {refreshing
                  ? t.pregnancy.recommendation.loading
                  : t.pregnancy.recommendation.regenerated}
              </button>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#d04f51]/20 bg-[#d04f51]/5 px-3 py-1.5 text-xs font-semibold text-[#d04f51]">
                <ArrowRight className="h-3.5 w-3.5" />
                {t.pregnancy.recommendation.viewDetails}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {recommendation ? (
            <>
              {translatedPreviewItems.length > 0 ? (
                <div className="recommendation-marquee-wrapper relative overflow-hidden rounded-2xl">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />

                  <div className="recommendation-marquee-track flex gap-4">
                    {marqueeItems.map((item, index) => {
                      const originalItem =
                        previewItems[index % previewItems.length] ?? item;

                      return (
                        <div
                          key={`${item}-${index}`}
                          className="w-[280px] shrink-0 rounded-xl border border-[#d04f51]/20 bg-[#d04f51]/5 p-4"
                        >
                          <h4 className="mb-2 text-sm font-semibold text-[#d04f51]">
                            {getCardTitleFromText(
                              originalItem,
                              index % previewItems.length,
                              t
                            )}
                          </h4>

                          <p className="text-sm leading-6 text-gray-700 line-clamp-5">
                            {item}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#d04f51]/20 bg-[#d04f51]/5 p-4">
                  <p className="text-sm leading-6 text-gray-700">
                    {translatedRecommendationText ||
                      recommendation.recommendation ||
                      t.pregnancy.recommendation.noRecommendation}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 rounded-2xl border border-[#d04f51]/15 bg-[#fffafa] p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.pregnancy.recommendation.personalizedSummary}
                  </p>

                  <p className="text-xs text-gray-500">
                    {t.pregnancy.recommendation.tapToOpen}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    {t.pregnancy.recommendation.checklist}: {completion.done}/
                    {completion.total}
                  </div>

                  {recommendation.regenerated ? (
                    <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                      {t.pregnancy.recommendation.regenerated}
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#d04f51]/20 bg-[#d04f51]/5 px-6 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <CheckCircle2 className="h-7 w-7 text-[#d04f51]/60" />
                </div>

                <p className="text-sm font-semibold text-gray-800">
                  {t.pregnancy.recommendation.noRecommendation}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {t.pregnancy.recommendation.noRecommendationDesc}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TodaysRecommendation;