"use client";

import React, { useEffect, useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import profileApi from "@/app/api/profile/api";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface Props {
  token: string;
  userId: number;
}

type PasswordField = "currentPassword" | "newPassword" | "confirmNewPassword";

const ChangePasswordCard = ({ token, userId }: Props) => {
  const { language, t } = useLanguage();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const translatedMessage = useTranslatedText(message?.text || "", language);

  const labels = t.profile.changePassword;

  const fieldConfig: Array<{
    name: PasswordField;
    label: string;
    placeholder: string;
  }> = [
    {
      name: "currentPassword",
      label: labels.currentPassword,
      placeholder: labels.currentPasswordPlaceholder,
    },
    {
      name: "newPassword",
      label: labels.newPassword,
      placeholder: labels.newPasswordPlaceholder,
    },
    {
      name: "confirmNewPassword",
      label: labels.confirmNewPassword,
      placeholder: labels.confirmNewPasswordPlaceholder,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const msg = await profileApi.changePassword(token, userId, form);
      setMessage({ type: "success", text: msg });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : labels.failedToChangePassword;

      setMessage({
        type: "error",
        text: errorMessage || labels.failedToChangePassword,
      });
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
        {fieldConfig.map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-xs font-medium capitalize text-gray-500">
              {field.label}
            </label>

            <PasswordInput
              name={field.name}
              placeholder={field.placeholder}
              className="w-full"
              autoComplete={
                field.name === "currentPassword"
                  ? "current-password"
                  : "new-password"
              }
              value={form[field.name]}
              onChange={(e) =>
                setForm({ ...form, [field.name]: e.target.value })
              }
            />
          </div>
        ))}

        {message && (
          <p
            className={`text-xs font-medium ${
              message.type === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {translatedMessage || message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#D04F51] py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547] disabled:opacity-60"
        >
          {loading ? labels.updating : labels.updatePassword}
        </button>
      </form>
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

export default ChangePasswordCard;