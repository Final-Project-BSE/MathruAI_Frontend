"use client";

import type { UserResponseDto } from "../../api/user-assign/types";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import type { AssignmentTranslations } from "./assignmentLang";
import { getStatusLabel } from "./assignmentLang";
import { cn, getReadableRoleLabel } from "./utils";

type Props = {
  user: UserResponseDto | null;
  open: boolean;
  onClose: () => void;
  onSendRequest?: (user: UserResponseDto) => void;
  sendingUserId?: number | null;
  statusLabel?: string;
  theme: "light" | "dark";
  labels: AssignmentTranslations;
};

export default function UserDetailsModal({
  user,
  open,
  onClose,
  onSendRequest,
  sendingUserId,
  statusLabel,
  theme,
  labels,
}: Props) {
  if (!user) return null;

  const isLightTheme = theme === "light";

  return (
    <Modal
      open={open}
      title={labels.details.userDetails}
      onClose={onClose}
      theme={theme}
      closeLabel={labels.common.close}
    >
      <div className="space-y-4">
        <div
          className={cn(
            "rounded-md border p-4",
            isLightTheme
              ? "border-gray-200 bg-gray-50"
              : "border-white/10 bg-white/5"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p
                className={cn(
                  "text-xs font-semibold",
                  isLightTheme ? "text-gray-900" : "text-white"
                )}
              >
                {user.firstName} {user.lastName}
              </p>
              <p className={cn("text-xs", isLightTheme ? "text-gray-600" : "text-gray-400")}>
                {user.email}
              </p>
            </div>

            {statusLabel ? (
              <StatusBadge status={statusLabel} label={getStatusLabel(statusLabel, labels)} />
            ) : null}
          </div>

          <div
            className={cn(
              "mt-3 grid gap-1 text-xs md:grid-cols-2",
              isLightTheme ? "text-gray-700" : "text-gray-300"
            )}
          >
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                {labels.common.role}:
              </span>{" "}
              {getReadableRoleLabel(user.roles, labels)}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                {labels.common.district}:
              </span>{" "}
              {user.district || labels.common.unavailable}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                {labels.common.mohArea}:
              </span>{" "}
              {user.mohArea || labels.common.unavailable}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                {labels.common.area}:
              </span>{" "}
              {user.area || labels.common.unavailable}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                {labels.common.latitude}:
              </span>{" "}
              {user.latitude ?? labels.common.unavailable}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                {labels.common.longitude}:
              </span>{" "}
              {user.longitude ?? labels.common.unavailable}
            </p>
            <p className="md:col-span-2">
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                {labels.common.roles}:
              </span>{" "}
              {user.roles.join(", ")}
            </p>
          </div>

          {onSendRequest ? (
            <button
              type="button"
              onClick={() => onSendRequest(user)}
              disabled={sendingUserId === user.id}
              className="mt-5 rounded-2xl bg-[#d04f51] px-4 py-1 text-sm text-white hover:bg-[#e86466] disabled:opacity-50"
            >
              {sendingUserId === user.id ? labels.common.sending : labels.common.sendRequest}
            </button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
