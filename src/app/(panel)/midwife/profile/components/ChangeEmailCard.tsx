'use client';

import React, { useState } from 'react';
import { PasswordInput } from '@/components/ui/password-input';
import profileApi from '@/app/api/profile/api';
import { useActionLogoutToast, errorToast } from '@/components/common/toast';

interface Props {
  token: string;
  userId: number;
  onUpdate: () => void;
}

const ChangeEmailCard = ({ token, userId }: Props) => {
  const { actionLogoutToast } = useActionLogoutToast();

  const [form, setForm] = useState({
    newEmail: '',
    currentPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordReady, setPasswordReady] = useState(false);

  const isAuthError = (message: string) => {
    const lower = message.toLowerCase();

    return (
      lower.includes('user not found') ||
      lower.includes('authentication') ||
      lower.includes('unauthorized') ||
      lower.includes('forbidden') ||
      lower.includes('token') ||
      lower.includes('jwt') ||
      lower.includes('signature')
    );
  };

  const clearLocalAuthCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.newEmail || !form.currentPassword) {
      errorToast('Please fill in all fields.');
      return;
    }

    if (!token || !userId) {
      errorToast('Profile session is not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);

    try {
      await profileApi.changeEmail(token, userId, form);

      setForm({
        newEmail: '',
        currentPassword: '',
      });

      /*
        Do NOT call onUpdate() here.

        After email change, the old JWT may no longer match the updated user identity.
        Refetching immediately with the old token can trigger backend JWT/auth errors.
      */
      clearLocalAuthCache();

      actionLogoutToast({
        title: 'Email Updated',
        description: (
          <>
            Your email has been changed successfully.
            <br />
            Please log out and sign in again with your new email.
          </>
        ),
        confirmText: 'Logout',
        cancelText: 'Close',
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to change email';

      if (isAuthError(errorMsg)) {
        clearLocalAuthCache();

        actionLogoutToast({
          title: 'Session Expired',
          description: (
            <>
              Your email may have been updated, but your session is no longer valid.
              <br />
              Please sign in again with your new email.
            </>
          ),
          confirmText: 'Sign In Again',
          cancelText: 'Close',
        });
      } else {
        errorToast(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-xl shadow-black/30">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
        Change Email
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">
            New Email
          </label>

          <input
            type="email"
            name="new-email"
            autoComplete="off"
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D04F51]/70"
            placeholder="newemail@example.com"
            value={form.newEmail}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                newEmail: e.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">
            Confirm with Password
          </label>

          <PasswordInput
            name="confirm-password-manual"
            placeholder="Enter your password"
            autoComplete="new-password"
            readOnly={!passwordReady}
            onFocus={() => setPasswordReady(true)}
            value={form.currentPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            className="w-full"
            inputClassName="rounded-lg border border-white/10 bg-black px-3 py-2 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D04F51]/70"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !form.newEmail || !form.currentPassword}
          className="w-full rounded-lg bg-[#D04F51] py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Change Email'}
        </button>
      </form>
    </div>
  );
};

export default ChangeEmailCard;