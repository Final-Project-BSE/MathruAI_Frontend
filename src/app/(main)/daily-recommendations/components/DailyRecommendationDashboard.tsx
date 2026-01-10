'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Loader2, AlertTriangle } from 'lucide-react';

// Import components
import DashboardHeader from './DashboardHeader';
import ErrorAlert from './ErrorAlert';
import SuccessAlert from './SuccessAlert';
import ProgressCard from './ProgressCard';
import RecommendationCard from './RecommendationCard';
import HistorySection from './HistorySection';
import SettingsModal from './SettingsModal';

// Import types
import type { UserData, RecommendationData, HistoryItem, APIResponse } from './types';

const DailyRecommendationDashboard = () => {
  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Data state
  const [userData, setUserData] = useState<UserData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // API Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const PREGNANCY_API = `${API_BASE_URL}/pregnancy`;

  // Initialize - Get JWT token from session and decode user ID
  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import('@/lib/authentication');
        const session = await getSession();

        if (session?.user?.token) {
          setToken(session.user.token);
          setIsAuthenticated(true);
          console.log("✅ JWT token loaded for Daily Recommendation Dashboard");
          
          // Decode JWT to extract user information
          try {
            const tokenParts = session.user.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log("Decoded JWT payload:", payload);
              
              // Extract user_id from JWT payload
              // Try multiple possible field names for user ID
              let uid = payload.user_id || payload.userId || payload.id || payload.uid;
              
              // If no direct user_id, try to get it from email or username
              if (!uid && payload.sub) {
                // Log warning and try to fetch user data from backend
                console.warn("No user_id in JWT token, will need to fetch from backend");
                
                // For now, we'll make a request to get user info
                // You might need to add an endpoint to get current user info
                try {
                  const userInfoResponse = await fetch(`${PREGNANCY_API}/auth/me`, {
                    headers: {
                      'Authorization': `Bearer ${session.user.token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();
                    uid = userInfo.user_id || userInfo.id;
                  }
                } catch (fetchError) {
                  console.error("Could not fetch user info from backend:", fetchError);
                }
              }
              
              if (uid) {
                const userId = typeof uid === 'number' ? uid : parseInt(uid.toString());
                
                if (isNaN(userId)) {
                  throw new Error("Invalid user ID format in token");
                }
                
                setUserId(userId);
                console.log("User ID extracted:", userId);
                
                loadAllData(session.user.token, userId);
              } else {
                throw new Error("No user ID found in JWT token. Please ensure your authentication token includes user_id.");
              }
            } else {
              throw new Error("Invalid JWT token format");
            }
          } catch (decodeError) {
            console.error("Failed to decode JWT or extract user ID:", decodeError);
            setError(`Authentication error: ${decodeError instanceof Error ? decodeError.message : 'Failed to extract user information'}`);
            setIsAuthenticated(false);
            setLoadingData(false);
          }
        } else {
          console.warn("⚠️ No session found — please log in first.");
          setError("Please log in to access the daily recommendations dashboard.");
          setIsAuthenticated(false);
          setLoadingData(false);
        }
      } catch (error) {
        console.error("Failed to get session:", error);
        setError("Authentication error. Please log in again.");
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
      await Promise.all([
        loadUserData(jwtToken, uid),
        loadRecommendation(jwtToken, uid),
        loadHistory(jwtToken, uid)
      ]);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      // Only set error for critical failures, not for missing data
      if (!errorMessage.includes('No data')) {
        setError(errorMessage);
      }
    } finally {
      setLoadingData(false);
    }
  };

  // Load user data (with better error handling like prediction section)
  const loadUserData = async (jwtToken: string, uid: number) => {
    try {
      const response = await fetch(`${PREGNANCY_API}/user/${uid}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load user data');
      }

      console.log('User data loaded:', data);
      setUserData(data);
    } catch (err) {
      console.error('Error loading user data:', err);
      throw err;
    }
  };

  // Load recommendation (with better error handling)
  const loadRecommendation = async (jwtToken: string, uid: number) => {
    try {
      const response = await fetch(`${PREGNANCY_API}/recommendation/${uid}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data) {
        console.log('Recommendation loaded:', data);
        setRecommendation(data);
      } else if (response.status === 404) {
        console.log('No recommendation found for today');
        setRecommendation(null);
      } else {
        throw new Error(data.error || 'Failed to load recommendation');
      }
    } catch (err) {
      console.error('Error loading recommendation:', err);
      // Don't throw - recommendation might not exist yet
      setRecommendation(null);
    }
  };

  // Load history
  const loadHistory = async (jwtToken: string, uid: number) => {
    try {
      const response = await fetch(
        `${PREGNANCY_API}/recommendations/history/${uid}?limit=7`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load history');
      }

      const data = await response.json();
      console.log('History loaded:', data);
      setHistory(data.recommendations || []);
    } catch (err) {
      console.error('Error loading history:', err);
      // Don't throw - history might be empty
    }
  };

  // Refresh recommendation (with better error handling)
  const handleRefresh = async () => {
    if (!token || !userId) {
      setError("Authentication required to refresh recommendation");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${PREGNANCY_API}/recommendation/${userId}?force_regenerate=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh recommendation');
      }

      setRecommendation(data);
      setSuccess('Recommendation refreshed successfully!');
      setTimeout(() => setSuccess(null), 3000);

      // Reload history
      await loadHistory(token, userId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh recommendation';
      setError(errorMessage);
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update user settings (with better error handling like prediction section)
  const handleUpdateSettings = async (pregnancyWeek: number, preferences: string) => {
    if (!token || !userId) {
      setError("Authentication required to update settings");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        pregnancy_week: pregnancyWeek,
        preferences: preferences,
        regenerate_recommendation: true
      };

      console.log('PUT request to:', `${PREGNANCY_API}/user/${userId}/data`);
      console.log('Payload:', payload);

      const response = await fetch(`${PREGNANCY_API}/user/${userId}/data`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      // Update local state
      if (userData) {
        setUserData({
          ...userData,
          pregnancy_week: pregnancyWeek,
          preferences: preferences
        });
      }

      // Update recommendation if regenerated
      if (data.new_recommendation) {
        setRecommendation({
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          recommendation: data.new_recommendation,
          regenerated: true
        });
      }

      setShowSettings(false);
      setSuccess('Settings updated and recommendation regenerated!');
      setTimeout(() => setSuccess(null), 3000);

      // Reload all data
      await loadAllData(token, userId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      console.error('Update settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout (same as prediction section)
  const handleLogout = async () => {
    try {
      // Clear local state
      setToken(null);
      setUserId(null);
      setIsAuthenticated(false);
      setUserData(null);
      setRecommendation(null);
      setHistory([]);
      
      // Optional: Call signOut if needed
      // const { signOut } = await import('@/lib/authentication');
      // await signOut();
      
      // Redirect to login or home
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
  };

  // Loading screen
  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  // Not authenticated screen (same as prediction section)
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
        {/* Header */}
        <DashboardHeader
          userName={userData?.name || 'User'}
          pregnancyWeek={userData?.pregnancy_week || 0}
          onRefresh={handleRefresh}
          onHistoryToggle={() => setShowHistory(!showHistory)}
          onLogout={handleLogout}
          loading={loading}
          showHistory={showHistory}
        />

        {/* Alerts */}
        <ErrorAlert error={error} onDismiss={() => setError(null)} />
        <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />

        {/* Progress Card */}
        {userData && (
          <div className="mb-8">
            <ProgressCard pregnancyWeek={userData.pregnancy_week} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommendation Card */}
          <div className="lg:col-span-2">
            <RecommendationCard
              recommendation={recommendation}
              onRefresh={handleRefresh}
              onSettingsClick={() => setShowSettings(true)}
              loading={loading}
              preferences={userData?.preferences}
            />
          </div>

          {/* History Section */}
          {showHistory && (
            <div className="lg:col-span-1">
              <HistorySection history={history} loading={false} />
            </div>
          )}
        </div>

        {/* Settings Modal */}
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