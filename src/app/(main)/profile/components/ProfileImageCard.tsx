"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import profileApi from "@/app/api/profile/api";
import type { ProfileResponse } from "@/app/api/profile/types";
import ProtectedImage from "../../../../lib/ProtectedImage";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface Props {
  profile: ProfileResponse | null;
  token: string;
  userId: number;
  onUpdate: () => void;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ProfileImageCard = ({ profile, token, userId, onUpdate }: Props) => {
  const { language, t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const translatedMessage = useTranslatedText(message?.text || "", language);

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
      setMessage({
        type: "error",
        text: t.profile.profileImage.invalidFileType,
      });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setMessage({
        type: "error",
        text: t.profile.profileImage.fileTooLarge,
      });
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
      setMessage({
        type: "error",
        text: t.profile.profileImage.sessionNotReady,
      });
      return;
    }

    if (!selectedFile) {
      setMessage({
        type: "error",
        text: t.profile.profileImage.chooseImageFirst,
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await profileApi.uploadProfileImage(token, userId, selectedFile);

      setMessage({
        type: "success",
        text: t.profile.profileImage.uploadSuccess,
      });

      setSelectedFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl("");
      setRefreshKey((prev) => prev + 1);
      onUpdate();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t.profile.profileImage.uploadFailed;

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const fallbackAvatar = (
    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-rose-200 bg-rose-100 text-2xl font-bold text-rose-600">
      {profile?.firstName?.[0] ?? "?"}
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-gray-800">
        {t.profile.profileImage.title}
      </h2>

      <div className="mb-4 flex items-center gap-4">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={t.profile.profileImage.profilePreviewAlt}
            width={80}
            height={80}
            unoptimized
            className="h-20 w-20 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <ProtectedImage
            key={`${profile?.profileImageUrl ?? "no-image"}-${refreshKey}`}
            src={profile?.profileImageUrl}
            token={token}
            alt={t.profile.profileImage.profileImageAlt}
            className="h-20 w-20 rounded-full border border-gray-200 object-cover"
            fallback={fallbackAvatar}
            loadingFallback={fallbackAvatar}
          />
        )}

        <div>
          <p className="text-xs text-gray-500">
            {t.profile.profileImage.acceptedFormats}
          </p>

          {profile?.profileImageUrl && (
            <p className="mt-1 break-all text-[11px] text-gray-400">
              {t.profile.profileImage.storedPath}: {profile.profileImageUrl}
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
          {t.profile.profileImage.chooseFile}
        </label>

        {selectedFile && (
          <p className="text-xs text-gray-500">
            {t.profile.profileImage.selected}: {selectedFile.name}
          </p>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={loading || !selectedFile || !token || !userId}
          className="w-full rounded-lg bg-[#D04F51] py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547] disabled:opacity-60"
        >
          {loading
            ? t.profile.profileImage.uploading
            : t.profile.profileImage.uploadUpdate}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-xs font-medium ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {translatedMessage || message.text}
        </p>
      )}
    </div>
  );
};

function useTranslatedText(text: string, language: "en" | "si" | "ta") {
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!text) {
        setTranslated("");
        return;
      }

      if (language === "en") {
        setTranslated(text);
        return;
      }

      const result = await translateText(text, language);

      if (!cancelled) {
        setTranslated(result);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [text, language]);

  return translated;
}

export default ProfileImageCard;