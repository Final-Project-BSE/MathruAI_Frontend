"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, AlertTriangle } from "lucide-react";

import DashboardHeader from "./DashboardHeader";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import ProgressCard from "./ProgressCard";
import RecommendationCard from "./RecommendationCard";
import HistorySection from "./HistorySection";
import SettingsModal from "./SettingsModal";

import type {
  UserData,
  RecommendationData,
  HistoryItem,
  ChecklistItem,
} from "../../../api/dailyrecommendation/types";

import apis from "../../../api/dailyrecommendation/api";
import { LoadingState } from "@/components/common/LoadingState";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { useLanguage } from "@/components/common/useLanguage";

const DailyRecommendationDashboard = () => {
  const { t } = useLanguage();
  const labels = t.dailyRecommendation;

  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [recommendation, setRecommendation] =
    useState<RecommendationData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [activePanel, setActivePanel] = useState<"checklist" | "history">(
    "checklist"
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();

        const jwt = session?.user?.token;

        if (!jwt) {
          setError(labels.loginRequiredError);
          setIsAuthenticated(false);
          setLoadingData(false);
          return;
        }

        setToken(jwt);
        setIsAuthenticated(true);

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
          setError(labels.authUserIdError);
          setIsAuthenticated(false);
          setLoadingData(false);
          return;
        }

        setUserId(uid);
        await loadAllData(jwt, uid);
        setError(null);
      } catch {
        setError(labels.authError);
        setIsAuthenticated(false);
      } finally {
        setLoadingData(false);
      }
    };

    initialize();
  }, [labels]);

  useEffect(() => {
    if (activePanel === "history" && token && userId) {
      void loadHistory(token, userId);
    }
  }, [activePanel, token, userId]);

  const loadAllData = async (jwtToken: string, uid: number) => {
    setLoadingData(true);

    try {
      await Promise.all([
        loadUserData(jwtToken, uid),
        loadRecommendation(jwtToken, uid),
        loadHistory(jwtToken, uid),
      ]);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : labels.loadDataFailed;
      if (!String(message).includes("No data")) {
        setError(message);
      }
    } finally {
      setLoadingData(false);
    }
  };

  const loadUserData = async (jwtToken: string, uid: number) => {
    const data = await apis.getUser(jwtToken, uid);
    setUserData(data);
  };

  const loadRecommendation = async (jwtToken: string, uid: number) => {
    try {
      const rec = await apis.getTodayRecommendation(jwtToken, uid);
      setRecommendation(rec);
    } catch {
      setRecommendation(null);
    }
  };

  const loadHistory = async (jwtToken: string, uid: number) => {
    try {
      const items = await apis.getHistory(jwtToken, uid, 7);

      const seen = new Set<string>();
      const deduped = items.filter((item) => {
        if (!item.date) return true;
        if (seen.has(item.date)) return false;
        seen.add(item.date);
        return true;
      });

      setHistory(deduped);
    } catch {
      setHistory([]);
    }
  };

  const handleRefresh = async () => {
    if (!token || !userId) {
      setError(labels.refreshAuthError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rec = await apis.refreshRecommendation(token, userId);
      setRecommendation(rec);
      setSuccess(labels.refreshSuccess);
      setTimeout(() => setSuccess(null), 3000);
      await loadHistory(token, userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.refreshFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChecklist = async (payload: {
    date: string;
    items: ChecklistItem[];
  }) => {
    if (!token || !userId) return;

    await apis.saveChecklist(token, userId, payload);

    setRecommendation((prev) => {
      if (!prev) return prev;
      if (prev.date !== payload.date) return prev;

      return {
        ...prev,
        checklist: payload.items,
      };
    });

    await loadHistory(token, userId);
  };

  const handleUpdateSettings = async (
    pregnancyWeek: number,
    preferences: string
  ) => {
    if (!token || !userId) {
      setError(labels.updateAuthError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        pregnancy_week: pregnancyWeek,
        preferences,
        regenerate_recommendation: true,
      };

      const data = await apis.updateUserSettings(token, userId, payload);

      if (userData) {
        setUserData({
          ...userData,
          pregnancy_week: pregnancyWeek,
          preferences,
        });
      }

      if (data?.new_recommendation) {
        setRecommendation({
          user_id: userId,
          date: new Date().toISOString().split("T")[0],
          recommendation: data.new_recommendation,
          regenerated: true,
          checklist: [],
        });
      }

      setShowSettings(false);
      setSuccess(labels.updateSuccess);
      setTimeout(() => setSuccess(null), 3000);

      await loadAllData(token, userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.updateFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    setUserData(null);
    setRecommendation(null);
    setHistory([]);
    window.location.href = "/login";
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#fcd4cd]">
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcd4cd] flex items-center justify-center p-6 md:p-8">
        <Card className="w-full max-w-md rounded-3xl border-0 bg-white shadow-[0_20px_60px_rgba(208,79,81,0.18)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center gap-2 text-center text-xl font-semibold text-[#d04f51]">
              <Heart className="h-6 w-6" />
              {labels.authRequiredTitle}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Alert className="rounded-2xl border border-[#f3c7c8] bg-[#fff5f5]">
              <AlertTriangle className="h-4 w-4 text-[#d04f51]" />
              <AlertDescription className="ml-2 text-sm text-[#7a2d2f]">
                {labels.authRequiredMessage}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcd4cd] px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] bg-white/40 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-6 lg:p-8">
          <TopBarFeatures />
          <DashboardHeader
            userName={userData?.name || "User"}
            pregnancyWeek={userData?.pregnancy_week || 0}
            onRefresh={handleRefresh}
            onLogout={handleLogout}
            loading={loading}
          />

          <div className="mt-6 space-y-4">
            <ErrorAlert error={error} onDismiss={() => setError(null)} />
            <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />
          </div>

          {userData && (
            <div className="mt-6">
              <div className="rounded-3xl border border-[#f3d6d7] bg-white p-4 shadow-sm md:p-5">
                <ProgressCard pregnancyWeek={userData.pregnancy_week} />
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="inline-flex w-full rounded-2xl border border-[#efc6c7] bg-white p-1.5 shadow-sm md:w-auto">
              <button
                type="button"
                onClick={() => setActivePanel("checklist")}
                className={[
                  "min-w-[140px] rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                  activePanel === "checklist"
                    ? "bg-[#d04f51] text-white shadow-[0_10px_25px_rgba(208,79,81,0.28)]"
                    : "text-[#7a2d2f] hover:bg-[#fff5f5]",
                ].join(" ")}
              >
                {labels.checklist}
              </button>

              <button
                type="button"
                onClick={() => setActivePanel("history")}
                className={[
                  "min-w-[140px] rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                  activePanel === "history"
                    ? "bg-[#d04f51] text-white shadow-[0_10px_25px_rgba(208,79,81,0.28)]"
                    : "text-[#7a2d2f] hover:bg-[#fff5f5]",
                ].join(" ")}
              >
                {labels.history}
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden">
            <div
              className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
                activePanel === "checklist"
                  ? "translate-x-0"
                  : "-translate-x-1/2"
              }`}
            >
              <div className="w-1/2 pr-0 md:pr-3">
                <div className="rounded-3xl border border-[#f1d2d3] bg-white p-4 shadow-sm md:p-5">
                  <RecommendationCard
                    recommendation={recommendation}
                    onRefresh={handleRefresh}
                    onSettingsClick={() => setShowSettings(true)}
                    loading={loading}
                    preferences={userData?.preferences}
                    userId={userId}
                    token={token}
                    onSaveChecklist={handleSaveChecklist}
                  />
                </div>
              </div>

              <div className="w-1/2 pl-0 md:pl-3">
                <div className="rounded-3xl border border-[#f1d2d3] bg-white p-4 shadow-sm md:p-5">
                  <HistorySection history={history} loading={false} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showSettings && userData && (
          <SettingsModal
            currentWeek={userData.pregnancy_week}
            currentPreferences={userData.preferences || ""}
            onSave={handleUpdateSettings}
            onClose={() => setShowSettings(false)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default DailyRecommendationDashboard;