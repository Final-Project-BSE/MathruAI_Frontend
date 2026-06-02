"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import profileApi from "@/app/api/profile/api";
import { logout } from "@/lib/authentication";
import { useLanguage } from "@/components/common/useLanguage";

interface Props {
  token: string;
  userId: number;
}

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallbackMessage;
};

const DeleteAccountCard = ({ token, userId }: Props) => {
  const { t } = useLanguage();

  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const labels = t.profile.deleteAccount;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    if (!token || !userId) {
      setError(labels.sessionNotReady);
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

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      router.replace("/sign-in");
      router.refresh();
    } catch (error: unknown) {
      setError(getErrorMessage(error, labels.sessionNotReady));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-red-600">
        {labels.title}
      </h2>

      <p className="mb-5 text-sm text-gray-500">
        {labels.warning1} <strong>{labels.warningPermanent}</strong>{" "}
        {labels.warning2}
      </p>

      {!confirm ? (
        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="w-full rounded-lg border border-red-900 bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          {labels.deleteMyAccount}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-sm font-semibold text-red-600">
            {labels.confirmQuestion}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirm(false)}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
            >
              {labels.cancel}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 rounded-lg bg-[#D04F51] py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547] disabled:opacity-60"
            >
              {loading ? labels.deleting : labels.yesDelete}
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DeleteAccountCard;