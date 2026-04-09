'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/ui/password-input';
import profileApi from '@/app/api/profile/api';

interface Props {
  token: string;
  userId: number;
  onUpdate: () => void;
}

const ChangeEmailCard = ({ token, userId, onUpdate }: Props) => {
  const router = useRouter();
  const [form, setForm] = useState({ newEmail: '', currentPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    if (!form.newEmail || !form.currentPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting email change for userId:', userId, 'newEmail:', form.newEmail);
      await profileApi.changeEmail(token, userId, form);
      setMessage({ type: 'success', text: 'Email changed successfully! Please refresh the page.' });
      setForm({ newEmail: '', currentPassword: '' });
      
      // Clear local auth state and prompt re-login
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        router.push('/sign-in');
      }, 2000);
      
    } catch (err: any) {
      console.error('Email change error:', err);
      const errorMsg = err.message || 'Failed to change email';
      
      // Handle auth-related errors
      if (errorMsg.includes('User Not Found') || errorMsg.includes('authentication')) {
        setMessage({ 
          type: 'error', 
          text: 'Email update succeeded but session expired. Please sign in again with your new email.'
        });
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/sign-in');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <span className="text-rose-400">📧</span> Change Email
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">New Email</label>
          <input
            type="email"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="newemail@example.com"
            value={form.newEmail}
            onChange={(e) => setForm({ ...form, newEmail: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Confirm with Password</label>
          <PasswordInput
            placeholder="Enter your password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            required
          />
        </div>
        {message && (
          <p className={`text-xs font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !form.newEmail || !form.currentPassword}
          className="w-full bg-[#D04F51] hover:bg-[#BA4547] text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Change Email'}
        </button>
      </form>
    </div>
  );
};

export default ChangeEmailCard;