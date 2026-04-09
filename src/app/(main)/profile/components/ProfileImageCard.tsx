'use client';

import React, { useEffect, useMemo, useState } from 'react';
import profileApi from '@/app/api/profile/api';
import type { ProfileResponse } from '@/app/api/profile/types';

interface Props {
  profile: ProfileResponse | null;
  token: string;
  userId: number;
  onUpdate: () => void;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const resolveProfileImageUrl = (profile: ProfileResponse | null) => {
  if (!profile) return '';

  return (
    profile.avatarUrl ||
    profile.profileImageUrl ||
    profile.profilePictureUrl ||
    profile.imageUrl ||
    profile.photoUrl ||
    profile.profileImage ||
    ''
  );
};

const toPreview = (file: File) => URL.createObjectURL(file);

const ProfileImageCard = ({ profile, token, userId, onUpdate }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const existingImage = useMemo(() => resolveProfileImageUrl(profile), [profile]);
  const imageToShow = previewUrl || existingImage;

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
    setPreviewUrl(toPreview(file));
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
      onUpdate();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload image.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await profileApi.deleteProfileImage(token, userId);
      setMessage({ type: 'success', text: 'Profile image removed successfully.' });
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');
      onUpdate();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete image.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Profile Image</h2>

      <div className="flex items-center gap-4 mb-4">
        {imageToShow ? (
          <img
            src={imageToShow}
            alt="Profile preview"
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold border border-rose-200">
            {profile?.firstName?.[0] ?? '?'}
          </div>
        )}
        <p className="text-xs text-gray-500">Accepted formats: JPG, PNG, WEBP (max 5MB)</p>
      </div>

      <div className="space-y-3">
        <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} />

        {selectedFile && (
          <p className="text-xs text-gray-500">Selected: {selectedFile.name}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || !selectedFile || !token || !userId}
            className="bg-[#D04F51] hover:bg-[#BA4547] text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Upload / Update'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || !existingImage}
            className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold py-2 rounded-lg text-sm transition disabled:opacity-60"
          >
            Delete Image
          </button>
        </div>
      </div>

      {message && (
        <p className={`mt-3 text-xs font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default ProfileImageCard;
