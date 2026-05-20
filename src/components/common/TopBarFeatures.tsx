"use client";

import Link from "next/link";
import {
  Bell,
  Syringe,
  CalendarPlus,
  MapPinned,
  Menu,
  MessageCircle,
  Package,
  CheckSquare,
} from "lucide-react";
import { getcuruser } from "@/app/api/user/api";
import type { UserResponseDto } from "@/app/api/user/types";
import { useEffect, useMemo, useState } from "react";
import ProtectedImage from "../../lib/ProtectedImage";
import MessagesPopup from "../../app/(connection)/messages/MessagesPopup";
import { chatApi } from "@/app/api/chat/api";
import ChecklistPopup from "@/app/(main)/checklist/ChecklistPopup";
import TriposhaPopup from "@/app/(main)/triposha/TriposhaPopup";
import MidwivesMapPopup from "@/app/(connection)/registered-midwives-map/MidwivesMapPopup";
import VaccinationPopup from "@/app/(main)/vaccination/VaccinationPopup";
import MotherAppointmentRequestDialog from "@/components/appointment/MotherAppointmentRequestDialog";
import { appointmentApi } from "@/app/api/appointment/api";
import { LanguageCode, useLanguage } from "./useLanguage";

type TopBarFeaturesProps = {
  name?: string;
  email?: string;
  avatarUrl?: string;
};

const languages: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "si", label: "සිං" },
  { code: "ta", label: "த" },
];

export default function TopBarFeatures({
  avatarUrl = "/images/reproductive/repro2.png",
}: TopBarFeaturesProps) {
  const [me, setMe] = useState<UserResponseDto | null>(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);

  const [messagesOpen, setMessagesOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [triposhaOpen, setTriposhaOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  const [token, setToken] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);

  const [midwivesMapOpen, setMidwivesMapOpen] = useState(false);
  const [vaccinationOpen, setVaccinationOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();

  const selectedLanguageLabel =
    languages.find((item) => item.code === language)?.label ?? "EN";

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

    try {
      const unread = await chatApi.getUnreadCount(me.id, token);
      setUnreadCount(unread.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load unread messages count:", error);
    }
  }

  async function refreshScheduledCount() {
    if (!token || !me?.id || !me.assignedMidwifeId) return;

    try {
      const appointments = await appointmentApi.getPatientAppointments(
        token,
        me.assignedMidwifeId,
        me.id
      );

      const deletedKey = `deletedAppointments:${me.id}`;
      let deletedIds: string[] = [];

      try {
        const raw = localStorage.getItem(deletedKey);
        if (raw) deletedIds = JSON.parse(raw) as string[];
      } catch {
        deletedIds = [];
      }

      setScheduledCount(
        appointments.filter(
          (item) =>
            item.status === "SCHEDULED" && !deletedIds.includes(item.id)
        ).length
      );
    } catch (error) {
      console.error("Failed to load scheduled appointments count:", error);
    }
  }

  useEffect(() => {
    void refreshScheduledCount();
  }, [token, me?.id, me?.assignedMidwifeId]);

  useEffect(() => {
    const handleAppointmentsChanged = () => {
      void refreshScheduledCount();
    };

    window.addEventListener("appointments:changed", handleAppointmentsChanged);

    return () => {
      window.removeEventListener(
        "appointments:changed",
        handleAppointmentsChanged
      );
    };
  }, [token, me?.id, me?.assignedMidwifeId]);

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
    return me.profileImageUrl || avatarUrl;
  }, [me, avatarUrl]);

  const isPostPregnantMother = useMemo(() => {
    return Boolean(me?.roles?.includes("POST_PREGNANT_MOTHER"));
  }, [me]);

  const avatarFallback = (
    <div className="flex h-full w-full items-center justify-center bg-violet-300 text-sm font-semibold text-violet-900">
      {fullname?.[0] ?? "?"}
    </div>
  );

  const openChecklist = () => {
    setChecklistOpen(true);
    setIsMobileFeaturesOpen(false);
  };

  const openTriposha = () => {
    setTriposhaOpen(true);
    setIsMobileFeaturesOpen(false);
  };

  return (
    <>
      <div className="mb-6 w-full">
        <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:rounded-full sm:px-4 sm:py-3 lg:gap-2">
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
                <span className="hidden min-[1250px]:inline">
                  {t.dashboard.chat}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMidwivesMapOpen(true)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                <MapPinned className="h-5 w-5 shrink-0 min-[1250px]:h-4 min-[1250px]:w-4" />
                <span className="hidden min-[1250px]:inline">
                  {t.dashboard.midwifeMap}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setVaccinationOpen(true)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                <Syringe className="h-5 w-5 shrink-0 min-[1250px]:h-4 min-[1250px]:w-4" />
                <span className="hidden min-[1250px]:inline">
                  {t.dashboard.vaccination}
                </span>
              </button>

              {isPostPregnantMother ? (
                <button
                  type="button"
                  onClick={openChecklist}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                >
                  <CheckSquare className="h-5 w-5 shrink-0 min-[1250px]:h-4 min-[1250px]:w-4" />
                  <span className="hidden min-[1250px]:inline">
                    {t.dashboard.checklist}
                  </span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={openTriposha}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                <Package className="h-5 w-5 shrink-0 min-[1250px]:h-4 min-[1250px]:w-4" />
                <span className="hidden min-[1250px]:inline">
                  {t.dashboard.triposha}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRequestDialogOpen(true)}
                className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                <CalendarPlus className="h-5 w-5 shrink-0 min-[1250px]:h-4 min-[1250px]:w-4" />
                <span className="hidden min-[1250px]:inline">
                  {t.dashboard.appointment}
                </span>
                {scheduledCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[#d04f51] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {scheduledCount > 99 ? "99+" : scheduledCount}
                  </span>
                ) : null}
              </button>
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
                <div className="absolute left-0 top-full z-20 mt-2 min-w-[190px] rounded-xl border border-neutral-200 bg-white p-1 shadow-md">
                  <button
                    type="button"
                    onClick={() => {
                      setMessagesOpen(true);
                      setIsMobileFeaturesOpen(false);
                    }}
                    className="relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    {unreadCount > 0 ? (
                      <span className="absolute right-2 top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null}
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    <span>{t.dashboard.messages}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMidwivesMapOpen(true);
                      setIsMobileFeaturesOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    <MapPinned className="h-4 w-4 shrink-0" />
                    <span>{t.dashboard.midwifeMap}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVaccinationOpen(true);
                      setIsMobileFeaturesOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    <Syringe className="h-4 w-4 shrink-0" />
                    <span>{t.dashboard.vaccination}</span>
                  </button>

                  {isPostPregnantMother ? (
                    <button
                      type="button"
                      onClick={openChecklist}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      <CheckSquare className="h-4 w-4 shrink-0" />
                      <span>{t.dashboard.checklist}</span>
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={openTriposha}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    <Package className="h-4 w-4 shrink-0" />
                    <span>{t.dashboard.triposha}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRequestDialogOpen(true);
                      setIsMobileFeaturesOpen(false);
                    }}
                    className="relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    <CalendarPlus className="h-4 w-4 shrink-0" />
                    <span>{t.dashboard.appointment}</span>
                    {scheduledCount > 0 ? (
                      <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-[#d04f51] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {scheduledCount > 99 ? "99+" : scheduledCount}
                      </span>
                    ) : null}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="hidden h-10 w-px shrink-0 bg-neutral-200 lg:block" />

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center rounded-full border border-neutral-200 bg-neutral-50 p-1 min-[1750px]:flex">
              {languages.map((item) => {
                const isActive = language === item.code;

                return (
                  <button
                    type="button"
                    key={item.code}
                    onClick={() => setLanguage(item.code)}
                    className={
                      isActive
                        ? "rounded-full bg-[#d04f51] px-2.5 py-1.5 text-xs font-medium text-white sm:px-3"
                        : "rounded-full px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 sm:px-3"
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="relative min-[1750px]:hidden">
              <button
                type="button"
                onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                aria-label="Select language"
              >
                {selectedLanguageLabel}
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 min-w-[72px] rounded-xl border border-neutral-200 bg-white p-1 shadow-md">
                  {languages.map((item) => {
                    const isActive = language === item.code;

                    return (
                      <button
                        type="button"
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={
                          isActive
                            ? "w-full rounded-lg bg-[#d04f51] px-3 py-2 text-left text-xs font-medium text-white"
                            : "w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                        }
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/profile"
              className="hidden min-w-0 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 p-1 pr-2 transition hover:bg-neutral-100 min-[900px]:flex"
            >
              <div className="h-9 w-9 overflow-hidden rounded-full">
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

      {isPostPregnantMother ? (
        <ChecklistPopup
          open={checklistOpen}
          onClose={() => setChecklistOpen(false)}
        />
      ) : null}

      <TriposhaPopup
        open={triposhaOpen}
        onClose={() => setTriposhaOpen(false)}
      />

      <MidwivesMapPopup
        open={midwivesMapOpen}
        onClose={() => setMidwivesMapOpen(false)}
      />

      <VaccinationPopup
        open={vaccinationOpen}
        onClose={() => setVaccinationOpen(false)}
      />

      {token && me?.id && me.assignedMidwifeId ? (
        <MotherAppointmentRequestDialog
          open={requestDialogOpen}
          onOpenChange={setRequestDialogOpen}
          token={token}
          midwifeId={me.assignedMidwifeId}
          userId={me.id}
        />
      ) : null}
    </>
  );
}