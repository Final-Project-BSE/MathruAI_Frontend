'use client';

import React, { useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import ChangePasswordCard from './ChangePasswordCard';
import ChangeEmailCard from './ChangeEmailCard';
import ChangeRoleCard from './ChangeRoleCard';
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
        let authToken = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

        if (!authToken) {
          try {
            const { getSession } = await import('@/lib/authentication');
            const session = await getSession();
            authToken = session?.user?.token || '';
          } catch {
            // Ignore fallback errors and rely on local storage token.
          }
        }

        if (!authToken) {
          setError('You are not authenticated. Please sign in again.');
          setLoading(false);
          return;
        }

        let authUserId = typeof window !== 'undefined' ? Number(localStorage.getItem('userId')) : 0;

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Header */}
      <ProfileHeader profile={profile} />

      {/* Two column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileImageCard
          profile={profile}
          token={token}
          userId={userId}
          onUpdate={() => fetchProfile(token, userId)}
        />
        <PersonalInfoCard
          profile={profile}
          token={token}
          userId={userId}
          onUpdate={() => fetchProfile(token, userId)}
        />
        <ChangeEmailCard
          token={token}
          userId={userId}
          onUpdate={() => fetchProfile(token, userId)}
        />
        <ChangePasswordCard
          token={token}
          userId={userId}
        />
        <ChangeRoleCard
          profile={profile}
          token={token}
          userId={userId}
          onUpdate={() => fetchProfile(token, userId)}
        />
      </div>

      {/* Delete - full width at bottom */}
      <DeleteAccountCard token={token} userId={userId} />
    </div>
  );
};

export default ProfileDashboard;