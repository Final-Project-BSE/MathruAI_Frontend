'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';
import profileApi from '@/app/api/profile/api';
import type { ProfileResponse, Role } from '@/app/api/profile/types';
import { logout } from '@/lib/authentication';
import { stageUpgradeToast } from '@/components/common/toast';

interface Props {
  profile: ProfileResponse | null;
  token: string;
  userId: number;
  onUpdate: () => void;
}

const STAGE_OPTIONS: Array<{ value: Role; label: string }> = [
  { value: 'HOPE_TO_PREGNANT_MOTHER', label: 'Hope To Pregnant Mother' },
  { value: 'PREGNANT_MOTHER', label: 'Pregnant Mother' },
  { value: 'POST_PREGNANT_MOTHER', label: 'Post Pregnant Mother' },
];

const normalizeRole = (role: string): Role =>
  role.replace(/^ROLE_/, '') as Role;

const ChangeRoleCard = ({ profile, token, userId, onUpdate }: Props) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const currentRoles = (profile?.roles || []).map((r) => normalizeRole(String(r)));
    const currentStage = currentRoles.find((r) =>
      STAGE_OPTIONS.some((opt) => opt.value === r)
    );
    setSelectedRole(currentStage || null);
  }, [profile]);

  const getStageLabel = (roleValue: Role): string => {
    return STAGE_OPTIONS.find((opt) => opt.value === roleValue)?.label || roleValue;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Continue local cleanup even if server action fails.
    }

    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    router.replace('/sign-in');
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setMessage({ type: 'error', text: 'Please select a stage.' });
      return;
    }

    const stageName = getStageLabel(selectedRole);

    setLoading(true);
    setMessage(null);

    try {
      await profileApi.changeRole(token, userId, { roles: [selectedRole] });
      setMessage({ type: 'success', text: `Stage updated to ${stageName}.` });
      stageUpgradeToast(stageName, handleLogout);

      onUpdate();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update stage';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-rose-400" /> Upgrade Stages
        </h2>

        {/* Current Stage Display */}
        {selectedRole && (
          <div className="mb-4 p-3 bg-rose-50 border-2 border-rose-200 rounded-lg">
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide">Current Stage</p>
            <p className="text-lg font-bold text-rose-600">{getStageLabel(selectedRole)}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select New Stage</p>
            <div className="flex gap-3 flex-wrap">
              {STAGE_OPTIONS.map((stage) => {
                const isActive = selectedRole === stage.value;
                return (
                  <button
                    key={stage.value}
                    type="button"
                    onClick={() => setSelectedRole(stage.value)}
                    className={`relative px-4 py-2 rounded-full text-sm font-semibold border-2 transition ${
                      isActive
                        ? 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-300'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {stage.label}
                      {isActive && (
                        <span className="inline-flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {message && (
            <p className={`text-xs font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !selectedRole}
            className="w-full bg-[#D04F51] hover:bg-[#BA4547] text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Stage'}
          </button>
        </form>
      </div>

    </>
  );
};

export default ChangeRoleCard;