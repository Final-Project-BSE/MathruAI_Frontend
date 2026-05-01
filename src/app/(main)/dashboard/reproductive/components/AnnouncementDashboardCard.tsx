"use client";

import React, { useEffect, useState } from "react";
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

function formatDate(dateStr?: string) {
  if (!dateStr) return "";

  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function AnnouncementDashboardCard() {
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();
        const token = session?.user?.token;

        if (!token) {
          setError("Please log in to view announcements.");
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
        setError("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncements();
  }, []);

  return (
    <Card className="bg-white/95 backdrop-blur border-0 shadow-md rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-black text-base md:text-lg">
            <Megaphone className="h-5 w-5 text-[#d04f51]" />
            Announcements
          </CardTitle>

          <Link href="/announcement">
            <Button
              size="sm"
              className="bg-[#d04f51] hover:bg-[#d63c3e] text-white text-xs"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading && (
          <div className="flex items-center justify-center py-10 text-[#d04f51]">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading announcements...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && announcements.length === 0 && (
          <div className="rounded-xl bg-pink-50 p-5 text-center">
            <Bell className="mx-auto h-9 w-9 text-[#d04f51] mb-3" />
            <h3 className="font-semibold text-gray-900">
              No active announcements
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              New updates will appear here when available.
            </p>
          </div>
        )}

        {!loading && !error && announcements.length > 0 && (
          <div className="space-y-2">
            {announcements.map((announcement) => {
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
                          {announcement.category}
                        </Badge>
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                        {announcement.content}
                      </p>

                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3 w-3 text-[#d04f51]" />
                        {formatDate(announcement.createdAt)}
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