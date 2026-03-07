'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, AlertTriangle } from 'lucide-react';

import DashboardHeader from './DashboardHeader';
import ErrorAlert from './ErrorAlert';
import SuccessAlert from './SuccessAlert';
import ProgressCard from './ProgressCard';
import RecommendationCard from './RecommendationCard';
import HistorySection from './HistorySection';
import SettingsModal from './SettingsModal';

import type {
  UserData,
  RecommendationData,
  HistoryItem,
  ChecklistItem,
} from '../../../api/dailyrecommendation/types';

import apis from '../../../api/dailyrecommendation/api';
import { LoadingState } from '@/components/common/LoadingState';

const DailyRecommendationDashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [activePanel, setActivePanel] = useState<'checklist' | 'history'>('checklist');

  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import('@/lib/authentication');
        const session = await getSession();

        const jwt = session?.user?.token;

        if (!jwt) {
          setError('Please log in to access the daily recommendations dashboard.');
          setIsAuthenticated(false);
          setLoadingData(false);
          return;
        }

        setToken(jwt);
        setIsAuthenticated(true);

        let uid: number | null = null;
        try {
          const me = await apis.me(jwt);
          const raw = (me.user_id ?? me.id) as any;
          if (raw !== undefined && raw !== null) {
            const parsed = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
            if (!Number.isNaN(parsed)) uid = parsed;
          }
        } catch {
          uid = null;
        }

        if (!uid) {
          setError('Authenticated, but could not resolve your user ID. Please log in again.');
          setIsAuthenticated(false);
          setLoadingData(false);
          return;
        }

        setUserId(uid);
        await loadAllData(jwt, uid);
        setError(null);
      } catch {
        setError('Authentication error. Please log in again.');
        setIsAuthenticated(false);
      } finally {
        setLoadingData(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (activePanel === 'history' && token && userId) {
      loadHistory(token, userId);
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      if (!String(errorMessage).includes('No data')) setError(errorMessage);
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
      const deduped = items.filter((it) => {
        if (!it.date) return true;
        if (seen.has(it.date)) return false;
        seen.add(it.date);
        return true;
      });

      setHistory(deduped);
    } catch {
      // ignore
    }
  };

  const handleRefresh = async () => {
    if (!token || !userId) {
      setError('Authentication required to refresh recommendation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rec = await apis.refreshRecommendation(token, userId);
      setRecommendation(rec);
      setSuccess('Recommendation refreshed successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await loadHistory(token, userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh recommendation');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChecklist = async (payload: { date: string; items: ChecklistItem[] }) => {
    if (!token || !userId) return;

    await apis.saveChecklist(token, userId, payload);

    // keep UI consistent immediately
    setRecommendation((prev) => {
      if (!prev) return prev;
      if (prev.date !== payload.date) return prev;
      return { ...prev, checklist: payload.items };
    });

    // OPTIONAL: refresh history so it shows updated completion immediately
    await loadHistory(token, userId);
  };

  const handleUpdateSettings = async (pregnancyWeek: number, preferences: string) => {
    if (!token || !userId) {
      setError('Authentication required to update settings');
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
        setUserData({ ...userData, pregnancy_week: pregnancyWeek, preferences });
      }

      if (data?.new_recommendation) {
        setRecommendation({
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          recommendation: data.new_recommendation,
          regenerated: true,
          checklist: [],
        });
      }

      setShowSettings(false);
      setSuccess('Settings updated and recommendation regenerated!');
      setTimeout(() => setSuccess(null), 3000);

      await loadAllData(token, userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    setUserData(null);
    setRecommendation(null);
    setHistory([]);
    window.location.href = '/login';
  };

  if (loadingData) {
    return (
      <div>
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#d5abc3] flex items-center justify-center p-8">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <Heart className="h-6 w-6 mr-2 text-pink-500" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-pink-200 bg-pink-50">
              <AlertTriangle className="h-4 w-4 text-pink-600" />
              <AlertDescription className="text-pink-800 ml-2">
                Please log in to access the Daily Recommendations Dashboard
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcd4cd] p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          userName={userData?.name || 'User'}
          pregnancyWeek={userData?.pregnancy_week || 0}
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          loading={loading}
        />

        <ErrorAlert error={error} onDismiss={() => setError(null)} />
        <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />

        {userData && (
          <div className="mb-8">
            <ProgressCard pregnancyWeek={userData.pregnancy_week} />
          </div>
        )}

        {/* Segmented toggle (like your screenshot) */}
        <div className="mb-4">
          <div className="w-full rounded-full bg-gray-200 p-1 flex">
            <button
              type="button"
              onClick={() => setActivePanel('checklist')}
              className={[
                'flex-1 rounded-full px-4 py-2 text-sm font-medium transition',
                activePanel === 'checklist'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              Checklist
            </button>

            <button
              type="button"
              onClick={() => setActivePanel('history')}
              className={[
                'flex-1 rounded-full px-4 py-2 text-sm font-medium transition',
                activePanel === 'history'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              History
            </button>
          </div>
        </div>

        {/* Sliding panels */}
        <div className="overflow-hidden">
          <div
            className={`flex w-[200%] transition-transform duration-500 ease-in-out ${activePanel === 'checklist' ? 'translate-x-0' : '-translate-x-1/2'
              }`}
          >
            {/* Panel 1: Checklist */}
            <div className="w-1/2 pr-4">
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

            {/* Panel 2: History */}
            <div className="w-1/2 pl-4">
              <HistorySection history={history} loading={false} />
            </div>
          </div>
        </div>

        {showSettings && userData && (
          <SettingsModal
            currentWeek={userData.pregnancy_week}
            currentPreferences={userData.preferences || ''}
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