'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Loader2, AlertTriangle } from 'lucide-react';

import DashboardHeader from './DashboardHeader';
import ErrorAlert from './ErrorAlert';
import SuccessAlert from './SuccessAlert';
import ProgressCard from './ProgressCard';
import RecommendationCard from './RecommendationCard';
import HistorySection from './HistorySection';
import SettingsModal from './SettingsModal';

import type { UserData, RecommendationData, HistoryItem } from '../../../api/dailyrecommendation/types';

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
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import('@/lib/authentication');
        const session = await getSession();

        if (!session?.user?.token) {
          console.warn('No session found — please log in first.');
          setError('Please log in to access the daily recommendations dashboard.');
          setIsAuthenticated(false);
          setLoadingData(false);
          return;
        }

        const jwt = session.user.token;
        setToken(jwt);
        setIsAuthenticated(true);
        console.log('JWT token loaded for Daily Recommendation Dashboard');

        try {
          const tokenParts = jwt.split('.');
          if (tokenParts.length !== 3) throw new Error('Invalid JWT token format');

          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded JWT payload:', payload);

          let uid = payload.user_id || payload.userId || payload.id || payload.uid;

          // Fallback
          if (!uid && payload.sub) {
            console.warn('No user_id in JWT token, will try /auth/me');
            try {
              const me = await apis.me(jwt);
              uid = me.user_id || me.id;
            } catch (fetchError) {
              console.error('Could not fetch user info from backend:', fetchError);
            }
          }

          if (!uid) {
            throw new Error(
              'No user ID found in JWT token. Please ensure your authentication token includes user_id.'
            );
          }

          const parsedUserId = typeof uid === 'number' ? uid : parseInt(uid.toString(), 10);
          if (Number.isNaN(parsedUserId)) throw new Error('Invalid user ID format in token');

          setUserId(parsedUserId);
          console.log('User ID extracted:', parsedUserId);

          await loadAllData(jwt, parsedUserId);
        } catch (decodeError) {
          console.error('Failed to decode JWT or extract user ID:', decodeError);
          setError(
            `Authentication error: ${
              decodeError instanceof Error ? decodeError.message : 'Failed to extract user information'
            }`
          );
          setIsAuthenticated(false);
        } finally {
          setLoadingData(false);
        }
      } catch (e) {
        console.error('Failed to get session:', e);
        setError('Authentication error. Please log in again.');
        setIsAuthenticated(false);
        setLoadingData(false);
      }
    };

    initialize();
  }, []);

  // Load all data
  const loadAllData = async (jwtToken: string, uid: number) => {
    setLoadingData(true);
    try {
      await Promise.all([loadUserData(jwtToken, uid), loadRecommendation(jwtToken, uid), loadHistory(jwtToken, uid)]);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      if (!errorMessage.includes('No data')) {
        setError(errorMessage);
      }
    } finally {
      setLoadingData(false);
    }
  };

  const loadUserData = async (jwtToken: string, uid: number) => {
    const data = await apis.getUser(jwtToken, uid);
    console.log('User data loaded:', data);
    setUserData(data);
  };

  const loadRecommendation = async (jwtToken: string, uid: number) => {
    try {
      const rec = await apis.getTodayRecommendation(jwtToken, uid);
      if (rec) console.log('Recommendation loaded:', rec);
      setRecommendation(rec);
    } catch (err) {
      console.error('Error loading recommendation:', err);
      // recommendation might not exist yet
      setRecommendation(null);
    }
  };

  const loadHistory = async (jwtToken: string, uid: number) => {
    try {
      const items = await apis.getHistory(jwtToken, uid, 7);
      console.log('History loaded:', items);
      setHistory(items);
    } catch (err) {
      console.error('Error loading history:', err);
      // history might be empty
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh recommendation';
      setError(errorMessage);
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
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

      console.log('PUT request to:', `/pregnancy/user/${userId}/data`);
      console.log('Payload:', payload);

      const data = await apis.updateUserSettings(token, userId, payload);
      console.log('Response:', data);

      if (userData) {
        setUserData({
          ...userData,
          pregnancy_week: pregnancyWeek,
          preferences,
        });
      }

      // If backend returns new recommendation
      if (data?.new_recommendation) {
        setRecommendation({
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          recommendation: data.new_recommendation,
          regenerated: true,
        });
      }

      setShowSettings(false);
      setSuccess('Settings updated and recommendation regenerated!');
      setTimeout(() => setSuccess(null), 3000);

      await loadAllData(token, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      console.error('Update settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setToken(null);
      setUserId(null);
      setIsAuthenticated(false);
      setUserData(null);
      setRecommendation(null);
      setHistory([]);

      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
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
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-8">
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          userName={userData?.name || 'User'}
          pregnancyWeek={userData?.pregnancy_week || 0}
          onRefresh={handleRefresh}
          onHistoryToggle={() => setShowHistory(!showHistory)}
          onLogout={handleLogout}
          loading={loading}
          showHistory={showHistory}
        />

        <ErrorAlert error={error} onDismiss={() => setError(null)} />
        <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />

        {userData && (
          <div className="mb-8">
            <ProgressCard pregnancyWeek={userData.pregnancy_week} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecommendationCard
              recommendation={recommendation}
              onRefresh={handleRefresh}
              onSettingsClick={() => setShowSettings(true)}
              loading={loading}
              preferences={userData?.preferences}
            />
          </div>

          {showHistory && (
            <div className="lg:col-span-1">
              <HistorySection history={history} loading={false} />
            </div>
          )}
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
