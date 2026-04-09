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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const msg = await profileApi.changePassword(token, userId, form);
      setMessage({ type: 'success', text: msg });
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <span className="text-rose-400">🔑</span> Change Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field) => (
          <div key={field}>
            <label className="text-xs font-medium text-gray-500 mb-1 block capitalize">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <PasswordInput
              placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              value={form[field as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          </div>
        ))}
        {message && (
          <p className={`text-xs font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D04F51] hover:bg-[#BA4547] text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordCard;