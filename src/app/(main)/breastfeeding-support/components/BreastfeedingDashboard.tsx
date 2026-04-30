'use client';

import React, { useEffect, useState } from 'react';
import { getSession } from '@/lib/authentication';
import { getcuruser } from '@/app/api/user/api';
import { LoadingState } from '@/components/common/LoadingState';
import TopBarFeatures from '@/components/common/TopBarFeatures';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import BreastfeedingSummaryCard from './BreastfeedingSummaryCard';
import SessionLogCard from './SessionLogCard';
import IssueTrackerCard from './IssueTrackerCard';
import TipsCard from './TipsCard';

import breastfeedingApi from '@/app/api/breastfeeding/api';
import type {
  BreastfeedingSessionResponseDto,
  BreastfeedingIssueResponseDto,
  BreastfeedingTipResponseDto,
} from '@/app/api/breastfeeding/types';

const BreastfeedingDashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<BreastfeedingSessionResponseDto[]>([]);
  const [issues, setIssues] = useState<BreastfeedingIssueResponseDto[]>([]);
  const [tips, setTips] = useState<BreastfeedingTipResponseDto[]>([]);

  const [activeTab, setActiveTab] = useState<'sessions' | 'issues' | 'tips'>('sessions');

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await getSession();
        const jwt = session?.user?.token;

        if (!jwt) {
          setError('Please log in to access Breastfeeding Support.');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setToken(jwt);
        setIsAuthenticated(true);

        const me = await getcuruser(jwt);
        const uid = me?.id;

        if (!uid) {
          setError('Could not resolve your user ID. Please log in again.');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        await loadAllData(jwt);
        setError(null);
      } catch {
        setError('Authentication error. Please log in again.');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const loadAllData = async (jwt: string) => {
    await Promise.all([
      loadSessions(jwt),
      loadIssues(jwt),
      loadTips(jwt),
    ]);
  };

  const loadSessions = async (jwt: string) => {
    try {
      const data = await breastfeedingApi.getSessions(jwt);
      setSessions(data);
    } catch {
      setSessions([]);
    }
  };

  const loadIssues = async (jwt: string) => {
    try {
      const data = await breastfeedingApi.getIssues(jwt);
      setIssues(data);
    } catch {
      setIssues([]);
    }
  };

  const loadTips = async (jwt: string) => {
    try {
      const data = await breastfeedingApi.getAllActiveTips(jwt);
      setTips(data);
    } catch {
      setTips([]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcd4cd]">
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcd4cd] flex items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-3xl border-0 bg-white shadow-[0_20px_60px_rgba(208,79,81,0.18)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center gap-2 text-center text-xl font-semibold text-[#d04f51]">
              <Heart className="h-6 w-6" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="rounded-2xl border border-[#f3c7c8] bg-[#fff5f5]">
              <AlertTriangle className="h-4 w-4 text-[#d04f51]" />
              <AlertDescription className="ml-2 text-sm text-[#7a2d2f]">
                Please log in to access the Breastfeeding Support section.
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

          {/* Page Header */}
          <div className="mb-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d04f51]">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#5f3a3b]">
                  Breastfeeding Support
                </h1>
                <p className="text-sm text-[#8a4b4c]">
                  Track sessions, report issues and read expert tips
                </p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 rounded-2xl border border-[#f3c7c8] bg-[#fff5f5]">
              <AlertTriangle className="h-4 w-4 text-[#d04f51]" />
              <AlertDescription className="ml-2 flex items-center justify-between text-sm text-[#7a2d2f]">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-[#d04f51] text-xl hover:opacity-70"
                >
                  ×
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Summary Card */}
          <div className="mb-6">
            <div className="rounded-3xl border border-[#f3d6d7] bg-white p-4 shadow-sm md:p-5">
              <BreastfeedingSummaryCard
                sessions={sessions}
                issues={issues}
              />
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="mb-6">
            <div className="inline-flex w-full rounded-2xl border border-[#efc6c7] bg-white p-1.5 shadow-sm">
              {(['sessions', 'issues', 'tips'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={[
                    'flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 capitalize',
                    activeTab === tab
                      ? 'bg-[#d04f51] text-white shadow-[0_10px_25px_rgba(208,79,81,0.28)]'
                      : 'text-[#7a2d2f] hover:bg-[#fff5f5]',
                  ].join(' ')}
                >
                  {tab === 'sessions'
                    ? '🤱 Sessions'
                    : tab === 'issues'
                    ? '⚠️ Issues'
                    : '💡 Tips'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="rounded-3xl border border-[#f1d2d3] bg-white p-4 shadow-sm md:p-5">
            {activeTab === 'sessions' && (
              <SessionLogCard
                sessions={sessions}
                token={token}
                onRefresh={() => token && loadSessions(token)}
              />
            )}
            {activeTab === 'issues' && (
              <IssueTrackerCard
                issues={issues}
                token={token}
                onRefresh={() => token && loadIssues(token)}
              />
            )}
            {activeTab === 'tips' && (
              <TipsCard
                tips={tips}
                token={token}
                onRefresh={() => token && loadTips(token)}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BreastfeedingDashboard;