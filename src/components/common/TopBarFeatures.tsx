"use client";

import Link from "next/link";
import {
  Bell,
  FileHeart,
  MapPinned,
  Menu,
  MessageCircle,
  Settings,
} from "lucide-react";
import { getcuruser } from "@/app/api/user/api";
import type { UserResponseDto } from "@/app/api/user/types";
import { useEffect, useMemo, useState } from "react";
import ProtectedImage from "../../lib/ProtectedImage";
import MessagesPopup from "../../app/(connection)/messages/MessagesPopup";
import { chatApi } from "@/app/api/chat/api";

type TopBarFeaturesProps = {
  name?: string;
  email?: string;
  avatarUrl?: string;
};

const baseFeatures = [
  { label: "Midwives Map", href: "/registered-midwives-map", icon: MapPinned },
  { label: "Health Records", href: "/health-records", icon: FileHeart },
  { label: "Settings", href: "/settings", icon: Settings },
];

const languages = ["EN", "සිං", "த"] as const;

export default function TopBarFeatures({
  avatarUrl = "/images/reproductive/repro2.png",
}: TopBarFeaturesProps) {
  const [me, setMe] = useState<UserResponseDto | null>(null);
  const [selectedLanguage, setSelectedLanguage] =
    useState<(typeof languages)[number]>("EN");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const [token, setToken] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();

        const sessionToken = session?.user?.token;
        if (!sessionToken) return;

        const user = await getcuruser(sessionToken);
        setMe(user);

        setToken(sessionToken);

        const unread = await chatApi.getUnreadCount(user.id, sessionToken);
        setUnreadCount(unread.unreadCount || 0);
      } catch (e) {
        console.error("Failed to load current user:", e);
      }
    };

    void loadMe();
  }, []);

  async function refreshUnreadCount() {
    if (!token || !me?.id) return;

    const unread = await chatApi.getUnreadCount(me.id, token);
    setUnreadCount(unread.unreadCount || 0);
  }

  const targetUserId = me?.assignedMidwifeId ?? null;

  const fullname = useMemo(() => {
    if (!me) return "—";
    return me.firstName || "—";
  }, [me]);

  const userEmail = useMemo(() => {
    if (!me) return "—";
    return me.email || "—";
  }, [me]);

  const resolvedAvatar = useMemo(() => {
    if (!me) return avatarUrl;

    return (
      me.avatarUrl ||
      me.profileImageUrl ||
      me.profilePictureUrl ||
      me.imageUrl ||
      me.photoUrl ||
      me.profileImage ||
      avatarUrl
    );
  }, [me, avatarUrl]);

  const avatarFallback = (
    <div className="flex h-full w-full items-center justify-center bg-violet-300 text-sm font-semibold text-violet-900">
      {fullname?.[0] ?? "?"}
    </div>
  );

  return (
    <>
      <div className="mb-6 w-full">
        <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:rounded-full sm:px-4 sm:py-3 lg:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="hidden min-w-0 flex-wrap items-center gap-2 min-[724px]:flex lg:flex-nowrap">
              <button
                type="button"
                onClick={() => setMessagesOpen(true)}
                className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
                <MessageCircle className="h-5 w-5 shrink-0 min-[1250px]:h-4 min-[1250px]:w-4" />
                <span className="hidden min-[1250px]:inline">Messages</span>
              </button>

              {baseFeatures.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                  >
                    <Icon className="h-5 w-5 shrink-0 min-[1250px]:h-4 min-[1250px]:w-4" />
                    <span className="hidden min-[1250px]:inline">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="relative min-[724px]:hidden">
              <button
                type="button"
                onClick={() => setIsMobileFeaturesOpen((prev) => !prev)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {isMobileFeaturesOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 min-w-[180px] rounded-xl border border-neutral-200 bg-white p-1 shadow-md">
                  <button
                    type="button"
                    onClick={() => {
                      setMessagesOpen(true);
                      setIsMobileFeaturesOpen(false);
                    }}
                    className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                  >
                    {unreadCount > 0 ? (
                      <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null}
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    <span>Messages</span>
                  </button>

                  {baseFeatures.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileFeaturesOpen(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="hidden h-10 w-px shrink-0 bg-neutral-200 lg:block" />

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 sm:h-11 sm:w-11"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <div className="hidden items-center rounded-full border border-neutral-200 bg-neutral-50 p-1 min-[1350px]:flex">
              {languages.map((lang) => {
                const isActive = selectedLanguage === lang;

                return (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={
                      isActive
                        ? "rounded-full bg-[#d04f51] px-2.5 py-1.5 text-xs font-medium text-white sm:px-3"
                        : "rounded-full px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 sm:px-3"
                    }
                  >
                    {lang}
                  </button>
                );
              })}
            </div>

            <div className="relative min-[1350px]:hidden">
              <button
                type="button"
                onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                aria-label="Select language"
              >
                {selectedLanguage}
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 min-w-[72px] rounded-xl border border-neutral-200 bg-white p-1 shadow-md">
                  {languages.map((lang) => {
                    const isActive = selectedLanguage === lang;

                    return (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={
                          isActive
                            ? "w-full rounded-lg bg-[#d04f51] px-3 py-2 text-left text-xs font-medium text-white"
                            : "w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                        }
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/profile"
              className="hidden min-w-0 items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 p-1 pr-3 transition hover:bg-neutral-100 min-[900px]:flex"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <ProtectedImage
                  src={resolvedAvatar}
                  alt={fullname}
                  token={token}
                  fallback={avatarFallback}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 leading-tight">
                <p className="max-w-[110px] truncate text-sm font-semibold text-neutral-900">
                  {fullname}
                </p>
                <p className="max-w-[140px] truncate text-xs text-neutral-500">
                  {userEmail}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <MessagesPopup
        open={messagesOpen}
        onClose={() => {
          setMessagesOpen(false);
          void refreshUnreadCount();
        }}
        targetUserId={targetUserId}
        theme="light"
      />
    </>
  );
}