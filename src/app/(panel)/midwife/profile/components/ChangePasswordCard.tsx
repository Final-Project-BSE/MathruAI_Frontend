'use client';

import React, { useState } from 'react';
import { PasswordInput } from '@/components/ui/password-input';
import profileApi from '@/app/api/profile/api';

interface Props {
  token: string;
  userId: number;
}

const ChangePasswordCard = ({ token, userId }: Props) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const msg = await profileApi.changePassword(token, userId, form);

      setMessage({ type: 'success', text: msg });
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-xl shadow-black/30">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {[
          'currentPassword',
          'newPassword',
          'confirmNewPassword',
        ].map((field) => (
          <div key={field}>
            <label className="mb-1 block text-xs font-medium capitalize text-zinc-400">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>

            <PasswordInput
              name={field}
              placeholder={`Enter ${field
                .replace(/([A-Z])/g, ' $1')
                .toLowerCase()}`}
              className="w-full"
              inputClassName="rounded-lg border border-white/10 bg-black px-3 py-2 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D04F51]/70"
              autoComplete={
                field === 'currentPassword'
                  ? 'current-password'
                  : 'new-password'
              }
              value={form[field as keyof typeof form]}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
            />
          </div>
        ))}

        {message ? (
          <p
            className={`text-xs font-medium ${
              message.type === 'success' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {message.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#D04F51] py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordCard;