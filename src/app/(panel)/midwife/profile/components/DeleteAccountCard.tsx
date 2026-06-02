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
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete account.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-red-500/20 bg-zinc-950 p-6 shadow-xl shadow-black/30">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-red-400">
        Delete Account
      </h2>

      <p className="mb-5 text-sm text-zinc-400">
        This action is{' '}
        <strong className="text-zinc-200">permanent</strong> and cannot be
        undone. All your data will be removed.
      </p>

      {!confirm ? (
        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="w-full rounded-lg border border-red-500/40 bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Delete My Account
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-sm font-semibold text-red-400">
            Are you absolutely sure?
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirm(false)}
              className="flex-1 rounded-lg border border-white/10 bg-black py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 rounded-lg bg-[#D04F51] py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}

      {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
    </div>
  );
};

export default DeleteAccountCard;