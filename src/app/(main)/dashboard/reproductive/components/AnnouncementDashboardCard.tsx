"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Clock,
  Loader2,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import announcementApi from "@/app/api/announcement/api";
import type { AnnouncementDto } from "@/app/api/announcement/types";
import {
  LanguageCode,
  useLanguage,
} from "../../../../../components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

function getCategoryStyles(category?: string) {
  switch ((category || "").toLowerCase()) {
    case "urgent":
      return {
        badge: "bg-red-50 text-[#d04f51] border-red-100",
        icon: "bg-red-100 text-[#d04f51]",
        border: "border-pink-100",
        bg: "bg-pink-50",
      };
    case "warning":
      return {
        badge: "bg-purple-50 text-[#d04f51] border-purple-100",
        icon: "bg-purple-100 text-[#d04f51]",
        border: "border-purple-100",
        bg: "bg-purple-50",
      };
    case "info":
      return {
        badge: "bg-pink-50 text-[#d04f51] border-pink-100",
        icon: "bg-pink-100 text-[#d04f51]",
        border: "border-pink-100",
        bg: "bg-white",
      };
    case "health":
      return {
        badge: "bg-green-50 text-green-700 border-green-100",
        icon: "bg-green-100 text-green-600",
        border: "border-green-100",
        bg: "bg-white",
      };
    default:
      return {
        badge: "bg-pink-50 text-[#d04f51] border-pink-100",
        icon: "bg-pink-100 text-[#d04f51]",
        border: "border-pink-100",
        bg: "bg-pink-50",
      };
  }
}

function getCategoryIcon(category?: string) {
  switch ((category || "").toLowerCase()) {
    case "urgent":
      return <AlertTriangle className="h-4 w-4" />;
    case "warning":
      return <Settings className="h-4 w-4" />;
    case "info":
      return <BookOpen className="h-4 w-4" />;
    case "health":
      return <Users className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

function getDateLocale(language: LanguageCode) {
  switch (language) {
    case "si":
      return "si-LK";
    case "ta":
      return "ta-LK";
    default:
      return "en-US";
  }
}

function formatDate(
  dateStr: string | undefined,
  language: LanguageCode,
  fallback = ""
) {
  if (!dateStr) return fallback;

  try {
    return new Date(dateStr).toLocaleDateString(getDateLocale(language), {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function translateCategory(
  category: string | undefined,
  t: ReturnType<typeof useLanguage>["t"]
) {
  switch ((category || "").toLowerCase()) {
    case "urgent":
      return t.reproductive.announcement.urgent;
    case "warning":
      return t.reproductive.announcement.warning;
    case "info":
      return t.reproductive.announcement.info;
    case "health":
      return t.reproductive.announcement.health;
    default:
      return category || "";
  }
}

export default function AnnouncementDashboardCard() {
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [translatedAnnouncements, setTranslatedAnnouncements] = useState<
    AnnouncementDto[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { language, t } = useLanguage();

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        setLoading(true);
        setError(null);

        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();
        const token = session?.user?.token;

        if (!token) {
          setError(t.reproductive.announcement.loginRequired);
          return;
        }

        const data = await announcementApi.getAllActiveAnnouncements(token);

        const latestTwo = [...data]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 2);

        setAnnouncements(latestTwo);
      } catch {
        setError(t.reproductive.announcement.failed);
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncements();
  }, [t]);

  useEffect(() => {
    let cancelled = false;

    async function translateAnnouncements() {
      if (language === "en") {
        setTranslatedAnnouncements(announcements);
        return;
      }

      if (announcements.length === 0) {
        setTranslatedAnnouncements([]);
        return;
      }

      try {
        setTranslating(true);

        const translated = await Promise.all(
          announcements.map(async (announcement) => {
            const [translatedTitle, translatedContent] = await Promise.all([
              translateText(announcement.title, language),
              translateText(announcement.content, language),
            ]);

            return {
              ...announcement,
              title: translatedTitle,
              content: translatedContent,
            };
          })
        );

        if (!cancelled) {
          setTranslatedAnnouncements(translated);
        }
      } finally {
        if (!cancelled) {
          setTranslating(false);
        }
      }
    }

    translateAnnouncements();

    return () => {
      cancelled = true;
    };
  }, [announcements, language]);

  const displayAnnouncements = useMemo(() => {
    return language === "en" ? announcements : translatedAnnouncements;
  }, [announcements, translatedAnnouncements, language]);

  return (
    <Card className="bg-white/95 backdrop-blur border-0 shadow-md rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-black text-base md:text-lg">
            <Megaphone className="h-5 w-5 text-[#d04f51]" />
            {t.reproductive.announcement.title}
          </CardTitle>

          <Link href="/announcement">
            <Button
              size="sm"
              className="bg-[#d04f51] hover:bg-[#d63c3e] text-white text-xs"
            >
              {t.dashboard.viewAll}
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading && (
          <div className="flex items-center justify-center py-10 text-[#d04f51]">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            {t.reproductive.announcement.loading}
          </div>
        )}

        {!loading && translating && (
          <div className="mb-3 flex items-center justify-center rounded-xl bg-pink-50 px-3 py-2 text-xs text-[#d04f51]">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Translating...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && displayAnnouncements.length === 0 && (
          <div className="rounded-xl bg-pink-50 p-5 text-center">
            <Bell className="mx-auto h-9 w-9 text-[#d04f51] mb-3" />
            <h3 className="font-semibold text-gray-900">
              {t.reproductive.announcement.noActive}
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {t.reproductive.announcement.noActiveDesc}
            </p>
          </div>
        )}

        {!loading && !error && displayAnnouncements.length > 0 && (
          <div className="space-y-2">
            {displayAnnouncements.map((announcement) => {
              const styles = getCategoryStyles(announcement.category);

              return (
                <div
                  key={announcement.announcementId}
                  className={`rounded-xl border ${styles.border} ${styles.bg} pl-4 pr-4 pb-2 pt-3`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
                    >
                      {getCategoryIcon(announcement.category)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-gray-900 leading-snug">
                          {announcement.title}
                        </h4>

                        <Badge
                          variant="outline"
                          className={`shrink-0 text-[10px] ${styles.badge}`}
                        >
                          {translateCategory(announcement.category, t)}
                        </Badge>
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                        {announcement.content}
                      </p>

                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3 w-3 text-[#d04f51]" />
                        {formatDate(announcement.createdAt, language)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}