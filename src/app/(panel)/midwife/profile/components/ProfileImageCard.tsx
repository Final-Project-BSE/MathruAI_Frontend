'use client';

import React, { useEffect, useState } from 'react';
import profileApi from '@/app/api/profile/api';
import type { ProfileResponse } from '@/app/api/profile/types';
import ProtectedImage from '../../../../../lib/ProtectedImage';

interface Props {
  profile: ProfileResponse | null;
  token: string;
  userId: number;
  onUpdate: () => void;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ProfileImageCard = ({ profile, token, userId, onUpdate }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a JPG, PNG, or WEBP image.' });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setMessage({ type: 'error', text: `Image must be smaller than ${MAX_SIZE_MB}MB.` });
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!token || !userId) {
      setMessage({ type: 'error', text: 'Profile session is not ready. Please refresh and try again.' });
      return;
    }

    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please choose an image first.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await profileApi.uploadProfileImage(token, userId, selectedFile);

      setMessage({ type: 'success', text: 'Profile image updated successfully.' });
      setSelectedFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');

      setRefreshKey((prev) => prev + 1);
      onUpdate();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload image.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const fallbackAvatar = (
    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D04F51]/40 bg-[#D04F51]/10 text-2xl font-bold text-[#fab0a7]">
      {profile?.firstName?.[0] ?? '?'}
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-xl shadow-black/30">
      <h2 className="mb-5 text-lg font-semibold text-white">Profile Image</h2>

      <div className="mb-4 flex items-center gap-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile preview"
            className="h-20 w-20 rounded-full border border-white/10 object-cover"
          />
        ) : (
          <ProtectedImage
            key={`${profile?.profileImageUrl ?? 'no-image'}-${refreshKey}`}
            src={profile?.profileImageUrl}
            token={token}
            alt="Profile image"
            className="h-20 w-20 rounded-full border border-white/10 object-cover"
            fallback={fallbackAvatar}
            loadingFallback={fallbackAvatar}
          />
        )}

        <div>
          <p className="text-xs text-zinc-400">
            Accepted formats: JPG, PNG, WEBP (max 5MB)
          </p>

          {profile?.profileImageUrl && (
            <p className="mt-1 break-all text-[11px] text-zinc-500">
              Stored path: {profile.profileImageUrl}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <input
          id="profile-image-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="profile-image-upload"
          className="inline-block cursor-pointer rounded-lg bg-[#D04F51] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547]"
        >
          Choose File
        </label>

        {selectedFile && (
          <p className="text-xs text-zinc-400">Selected: {selectedFile.name}</p>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={loading || !selectedFile || !token || !userId}
          className="w-full rounded-lg bg-[#D04F51] py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Uploading...' : 'Upload / Update'}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-xs font-medium ${
            message.type === 'success' ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default ProfileImageCard;