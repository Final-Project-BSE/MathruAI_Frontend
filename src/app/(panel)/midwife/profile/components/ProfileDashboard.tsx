'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import ChangePasswordCard from './ChangePasswordCard';
import ChangeEmailCard from './ChangeEmailCard';
import DeleteAccountCard from './DeleteAccountCard';
import ProfileImageCard from './ProfileImageCard';

import profileApi from '@/app/api/profile/api';
import type { ProfileResponse } from '@/app/api/profile/types';
import { getcuruser } from '@/app/api/user/api';
import { getSession, logout } from '@/lib/authentication';

const ProfileDashboard = () => {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthError = (message: string) => {
    const lower = message.toLowerCase();

    return (
      lower.includes('jwt') ||
      lower.includes('signature') ||
      lower.includes('token') ||
      lower.includes('unauthorized') ||
      lower.includes('forbidden') ||
      lower.includes('authentication')
    );
  };

  const clearBadSession = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Continue local cleanup even if server-side logout fails.
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }

    router.replace('/sign-in');
    router.refresh();
  }, [router]);

  const fetchProfile = useCallback(
    async (authToken: string, authUserId: number) => {
      if (!authToken || !authUserId) {
        setError('Profile session is not ready. Please sign in again.');
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await profileApi.getProfile(authToken, authUserId);
        setProfile(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load profile data.';

        setError(message);
        setProfile(null);

        if (isAuthError(message)) {
          await clearBadSession();
        }
      } finally {
        setLoading(false);
      }
    },
    [clearBadSession]
  );

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        const session = await getSession();
        const authToken = session?.user?.token || '';

        if (!authToken) {
          setError('You are not authenticated. Please sign in again.');
          setLoading(false);
          await clearBadSession();
          return;
        }

        const me = await getcuruser(authToken);

        if (!active) return;

        setToken(authToken);
        setUserId(me.id);

        /*
          Important:
          Do not keep using localStorage token.
          It can become stale and cause:
          "JWT signature does not match locally computed signature"
        */
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.setItem('userId', String(me.id));
        }

        await fetchProfile(authToken, me.id);
      } catch (err: unknown) {
        if (!active) return;

        const message =
          err instanceof Error ? err.message : 'Failed to load profile data.';

        setError(message);
        setProfile(null);
        setLoading(false);

        if (isAuthError(message)) {
          await clearBadSession();
        }
      }
    };

    void init();

    return () => {
      active = false;
    };
  }, [clearBadSession, fetchProfile]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#D04F51]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12 text-white">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <ProfileHeader profile={profile} token={token} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfileImageCard
            profile={profile}
            token={token}
            userId={userId}
            onUpdate={() => fetchProfile(token, userId)}
          />
        </div>

        <div className="lg:col-span-2">
          <PersonalInfoCard
            profile={profile}
            token={token}
            userId={userId}
            onUpdate={() => fetchProfile(token, userId)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ChangeEmailCard
          token={token}
          userId={userId}
          onUpdate={() => fetchProfile(token, userId)}
        />

        <ChangePasswordCard token={token} userId={userId} />
      </div>

      <div>
        <DeleteAccountCard token={token} userId={userId} />
      </div>
    </div>
  );
};

export default ProfileDashboard;