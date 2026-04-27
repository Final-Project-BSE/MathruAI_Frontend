"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  AlertTriangle,
  BookOpen,
  Settings,
  Users,
  Bell,
  Megaphone,
} from "lucide-react";
import { AnnouncementDto } from "@/app/api/announcement/types";
import announcementApi from "@/app/api/announcement/api";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { LoadingState } from "@/components/common/LoadingState";

const getCategoryStyles = (category: string) => {
  switch (category.toLowerCase()) {
    case "urgent":
      return {
        badge: "bg-red-100 text-red-700 border-red-200",
        border: "border-l-red-400",
        icon: "bg-red-100 text-red-500",
        glow: "hover:shadow-red-100",
      };
    case "warning":
      return {
        badge: "bg-orange-100 text-orange-700 border-orange-200",
        border: "border-l-orange-400",
        icon: "bg-orange-100 text-orange-500",
        glow: "hover:shadow-orange-100",
      };
    case "info":
      return {
        badge: "bg-green-100 text-green-700 border-green-200",
        border: "border-l-green-500",
        icon: "bg-green-100 text-green-500",
        glow: "hover:shadow-green-100",
      };
    case "health":
      return {
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        border: "border-l-emerald-400",
        icon: "bg-emerald-100 text-emerald-500",
        glow: "hover:shadow-emerald-100",
      };
    default:
      return {
        badge: "bg-[#d04f51]/10 text-[#d04f51] border-[#d04f51]/20",
        border: "border-l-[#d04f51]",
        icon: "bg-[#d04f51]/10 text-[#d04f51]",
        glow: "hover:shadow-[#d04f51]/10",
      };
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "urgent":
      return <AlertTriangle className="w-5 h-5" />;
    case "warning":
      return <Settings className="w-5 h-5" />;
    case "info":
      return <BookOpen className="w-5 h-5" />;
    case "health":
      return <Users className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async (jwt: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await announcementApi.getAllActiveAnnouncements(jwt);
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to load announcements:", err);
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();
        const jwt = session?.user?.token;

        if (!jwt) {
          setError("Please log in to view announcements.");
          setLoading(false);
          return;
        }

        await fetchAnnouncements(jwt);
      } catch (err) {
        console.error("Announcement authentication error:", err);
        setError("Authentication error. Please log in again.");
        setLoading(false);
      }
    };

    initialize();
  }, [fetchAnnouncements]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
        <TopBarFeatures />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
      <TopBarFeatures />

      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Megaphone className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold md:text-2xl">Announcements</h1>
            <p className="text-sm opacity-90 mt-0.5">
              Stay informed with the latest updates
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
            <Bell className="h-4 w-4" />
            <span className="text-sm font-semibold">
              {announcements.length} Active
            </span>
          </div>
        </div>
      </div>

      <Card className="bg-white/90 backdrop-blur shadow-md">
        <CardContent className="p-4 md:p-6">
          {announcements.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d04f51]/10 mb-4">
                <Bell className="h-8 w-8 text-[#d04f51]" />
              </div>
              <p className="text-gray-600 font-medium">
                No announcements available
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Check back later for updates
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((announcement) => {
              const styles = getCategoryStyles(announcement.category);

              return (
                <Card
                  key={announcement.announcementId}
                  className={`bg-white border-l-4 ${styles.border} ${styles.glow} hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                      >
                        {getCategoryIcon(announcement.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900 leading-snug">
                            {announcement.title}
                          </h4>

                          <Badge
                            variant="outline"
                            className={`text-xs font-medium whitespace-nowrap shrink-0 ${styles.badge}`}
                          >
                            {announcement.category}
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed mb-2">
                          {announcement.content}
                        </p>

                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(announcement.createdAt)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}