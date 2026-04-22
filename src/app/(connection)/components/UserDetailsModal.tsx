"use client";

import type { UserResponseDto } from "../../api/user-assign/types";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { cn, getReadableRoleLabel } from "./utils";

type Props = {
  user: UserResponseDto | null;
  open: boolean;
  onClose: () => void;
  onSendRequest?: (user: UserResponseDto) => void;
  sendingUserId?: number | null;
  statusLabel?: string;
  theme: "light" | "dark";
};

export default function UserDetailsModal({
  user,
  open,
  onClose,
  onSendRequest,
  sendingUserId,
  statusLabel,
  theme,
}: Props) {
  if (!user) return null;

  const isLightTheme = theme === "light";

  return (
    <Modal open={open} title="User Details" onClose={onClose} theme={theme}>
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

            {statusLabel ? <StatusBadge status={statusLabel} /> : null}
          </div>

          <div
            className={cn(
              "mt-3 grid gap-1 text-xs md:grid-cols-2",
              isLightTheme ? "text-gray-700" : "text-gray-300"
            )}
          >
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                Role:
              </span>{" "}
              {getReadableRoleLabel(user.roles)}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                District:
              </span>{" "}
              {user.district || "-"}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                MOH Area:
              </span>{" "}
              {user.mohArea || "-"}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                Area:
              </span>{" "}
              {user.area || "-"}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                Latitude:
              </span>{" "}
              {user.latitude ?? "-"}
            </p>
            <p>
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                Longitude:
              </span>{" "}
              {user.longitude ?? "-"}
            </p>
            <p className="md:col-span-2">
              <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
                Roles:
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
              {sendingUserId === user.id ? "Sending..." : "Send Request"}
            </button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}