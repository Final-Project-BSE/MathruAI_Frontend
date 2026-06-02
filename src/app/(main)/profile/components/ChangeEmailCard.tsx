"use client";

import React, { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import profileApi from "@/app/api/profile/api";
import { useActionLogoutToast, errorToast } from "@/components/common/toast";
import { useLanguage } from "@/components/common/useLanguage";

interface Props {
  token: string;
  userId: number;
  onUpdate: () => void;
}

const ChangeEmailCard = ({ token, userId, onUpdate }: Props) => {
  const { actionLogoutToast } = useActionLogoutToast();
  const { t } = useLanguage();

  const [form, setForm] = useState({ newEmail: "", currentPassword: "" });
  const [loading, setLoading] = useState(false);
  const [passwordReady, setPasswordReady] = useState(false);

  const labels = t.profile.changeEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.newEmail || !form.currentPassword) {
      errorToast(labels.fillAllFields);
      return;
    }

    setLoading(true);

    try {
      await profileApi.changeEmail(token, userId, form);

      setForm({ newEmail: "", currentPassword: "" });
      onUpdate();

      actionLogoutToast({
        title: labels.emailUpdatedTitle,
        description: (
          <>
            {labels.emailUpdatedDescription1}
            <br />
            {labels.emailUpdatedDescription2}
          </>
        ),
        confirmText: labels.logout,
        cancelText: labels.close,
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : labels.failedToChangeEmail;

      if (
        errorMsg.includes("User Not Found") ||
        errorMsg.toLowerCase().includes("authentication")
      ) {
        actionLogoutToast({
          title: labels.sessionExpiredTitle,
          description: (
            <>
              {labels.sessionExpiredDescription1}
              <br />
              {labels.sessionExpiredDescription2}
            </>
          ),
          confirmText: labels.signInAgain,
          cancelText: labels.close,
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
        {labels.title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {labels.newEmail}
          </label>
          <input
            type="email"
            name="new-email"
            autoComplete="off"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder={labels.newEmailPlaceholder}
            value={form.newEmail}
            onChange={(e) => setForm({ ...form, newEmail: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {labels.confirmWithPassword}
          </label>
          <PasswordInput
            name="confirm-password-manual"
            placeholder={labels.passwordPlaceholder}
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
          {loading ? labels.updating : labels.changeEmail}
        </button>
      </form>
    </div>
  );
};

export default ChangeEmailCard;