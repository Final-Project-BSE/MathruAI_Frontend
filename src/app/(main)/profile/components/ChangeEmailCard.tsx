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

const ChangeEmailCard = ({ token, userId, onUpdate }: Props) => {
  const { actionLogoutToast } = useActionLogoutToast();

  const [form, setForm] = useState({ newEmail: '', currentPassword: '' });
  const [loading, setLoading] = useState(false);
  const [passwordReady, setPasswordReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.newEmail || !form.currentPassword) {
      errorToast('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      await profileApi.changeEmail(token, userId, form);

      setForm({ newEmail: '', currentPassword: '' });
      onUpdate();

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
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to change email';

      if (
        errorMsg.includes('User Not Found') ||
        errorMsg.toLowerCase().includes('authentication')
      ) {
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
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-800">
        Change Email
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            New Email
          </label>
          <input
            type="email"
            name="new-email"
            autoComplete="off"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="newemail@example.com"
            value={form.newEmail}
            onChange={(e) => setForm({ ...form, newEmail: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
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
    setForm({ ...form, currentPassword: e.target.value })
  }
  className="w-full"
  inputClassName="rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
/>
        </div>

        <button
          type="submit"
          disabled={loading || !form.newEmail || !form.currentPassword}
          className="w-full rounded-lg bg-[#D04F51] py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547] disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Change Email'}
        </button>
      </form>
    </div>
  );
};

export default ChangeEmailCard;