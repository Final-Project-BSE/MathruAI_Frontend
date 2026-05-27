"use client";

import React, { useEffect, useState } from "react";
import profileApi from "@/app/api/profile/api";
import type { ProfileResponse, Role } from "@/app/api/profile/types";
import { useActionLogoutToast, errorToast } from "@/components/common/toast";
import { useLanguage } from "@/components/common/useLanguage";

interface Props {
  profile: ProfileResponse | null;
  token: string;
  userId: number;
  onUpdate: () => void;
}

const STAGE_VALUES: Role[] = [
  "HOPE_TO_PREGNANT_MOTHER",
  "PREGNANT_MOTHER",
  "POST_PREGNANT_MOTHER",
];

const ChangeRoleCard = ({ profile, token, userId, onUpdate }: Props) => {
  const { actionLogoutToast } = useActionLogoutToast();
  const { t } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  const labels = t.profile.changeRole;

  const stageOptions = STAGE_VALUES.map((value) => ({
    value,
    label: labels.stages[value] || value,
  }));

  useEffect(() => {
    const currentStage = (profile?.roles || []).find((r) =>
      STAGE_VALUES.some((value) => value === r)
    );

    setSelectedRole(currentStage || null);
  }, [profile]);

  const getStageLabel = (roleValue: Role): string => {
    return labels.stages[roleValue] || roleValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      errorToast(labels.selectStageError);
      return;
    }

    const stageName = getStageLabel(selectedRole);

    setLoading(true);

    try {
      await profileApi.changeRole(token, userId, { roles: [selectedRole] });

      onUpdate();

      actionLogoutToast({
        title: labels.stageUpgradedTitle,
        description: (
          <>
            {labels.stageUpgradedDescription1} <strong>"{stageName}"</strong>.
            <br />
            {labels.stageUpgradedDescription2} <strong>"{stageName}"</strong>.
          </>
        ),
        confirmText: labels.logout,
        cancelText: labels.close,
      });
    } catch (err: any) {
      errorToast(err.message || labels.failedToUpdateStage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-gray-800">
        {labels.title}
      </h2>

      {selectedRole && (
        <div className="mb-4 rounded-lg border-2 border-green-200 bg-green-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
            {labels.currentStage}
          </p>
          <p className="text-lg font-bold text-green-600">
            {getStageLabel(selectedRole)}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.selectNewStage}
          </p>

          <div className="flex flex-wrap gap-3">
            {stageOptions.map((stage) => {
              const isActive = selectedRole === stage.value;

              return (
                <button
                  key={stage.value}
                  type="button"
                  onClick={() => setSelectedRole(stage.value)}
                  className={`relative rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-green-600 bg-green-800 text-white shadow-lg shadow-rose-300"
                      : "border-gray-200 bg-white text-gray-600 hover:border-rose-300"
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedRole}
          className="w-full rounded-lg bg-[#D04F51] py-2 text-sm font-semibold text-white transition hover:bg-[#BA4547] disabled:opacity-60"
        >
          {loading ? labels.saving : labels.saveStage}
        </button>
      </form>
    </div>
  );
};

export default ChangeRoleCard;