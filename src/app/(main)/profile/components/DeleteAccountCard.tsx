'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import profileApi from '@/app/api/profile/api';
import { logout } from '@/lib/authentication';

interface Props {
  token: string;
  userId: number;
}

const DeleteAccountCard = ({ token, userId }: Props) => {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    if (!token || !userId) {
      setError('Profile session is not ready. Please refresh and try again.');
      setLoading(false);
      return;
    }

    try {
      await profileApi.deleteAccount(token, userId);

      try {
        await logout();
      } catch {
        // Continue local cleanup even if server-side cookie cleanup fails.
      }

      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      router.replace('/sign-in');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
      <h2 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
        <span>🗑️</span> Delete Account
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        This action is <strong>permanent</strong> and cannot be undone. All your data will be removed.
      </p>

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="w-full border border-red-300 text-red-500 hover:bg-red-50 font-semibold py-2 rounded-lg text-sm transition"
        >
          Delete My Account
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-red-600 text-center">
            Are you absolutely sure?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirm(false)}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2 rounded-lg text-sm transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-[#D04F51] hover:bg-[#BA4547] text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-60"
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default DeleteAccountCard;