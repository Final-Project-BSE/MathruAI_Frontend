'use client';

import React, { useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import ChangePasswordCard from './ChangePasswordCard';
import ChangeEmailCard from './ChangeEmailCard';
import DeleteAccountCard from './DeleteAccountCard';
import ProfileImageCard from './ProfileImageCard';
import profileApi from '@/app/api/profile/api';
import type { ProfileResponse } from '@/app/api/profile/types';
import { getcuruser } from '@/app/api/user/api';

const ProfileDashboard = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (authToken: string, authUserId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileApi.getProfile(authToken, authUserId);
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        let authToken =
          typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

        if (!authToken) {
          try {
            const { getSession } = await import('@/lib/authentication');
            const session = await getSession();
            authToken = session?.user?.token || '';
          } catch {
            // ignore
          }
        }

        if (!authToken) {
          setError('You are not authenticated. Please sign in again.');
          setLoading(false);
          return;
        }

        let authUserId =
          typeof window !== 'undefined' ? Number(localStorage.getItem('userId')) : 0;

        if (!authUserId) {
          const me = await getcuruser(authToken);
          authUserId = me.id;
          if (typeof window !== 'undefined') {
            localStorage.setItem('userId', String(me.id));
          }
        }

        setToken(authToken);
        setUserId(authUserId);
        await fetchProfile(authToken, authUserId);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data.');
        setLoading(false);
      }
    };

    init();
  }, []);

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