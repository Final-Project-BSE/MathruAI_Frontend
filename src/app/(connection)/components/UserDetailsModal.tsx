"use client";

import type { UserResponseDto } from "../../api/user-assign/types";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { getReadableRoleLabel } from "./utils";

type Props = {
  user: UserResponseDto | null;
  open: boolean;
  onClose: () => void;
  onSendRequest?: (user: UserResponseDto) => void;
  sendingUserId?: number | null;
  statusLabel?: string;
};

export default function UserDetailsModal({
  user,
  open,
  onClose,
  onSendRequest,
  sendingUserId,
  statusLabel,
}: Props) {
  if (!user) return null;

  return (
    <Modal open={open} title="User Details" onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-md border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>

            {statusLabel ? <StatusBadge status={statusLabel} /> : null}
          </div>

          <div className="mt-3 grid gap-1 text-xs text-gray-300 md:grid-cols-2">
            <p>
              <span className="font-medium text-white">Role:</span>{" "}
              {getReadableRoleLabel(user.roles)}
            </p>
            <p>
              <span className="font-medium text-white">District:</span>{" "}
              {user.district || "-"}
            </p>
            <p>
              <span className="font-medium text-white">MOH Area:</span>{" "}
              {user.mohArea || "-"}
            </p>
            <p>
              <span className="font-medium text-white">Area:</span>{" "}
              {user.area || "-"}
            </p>
            <p>
              <span className="font-medium text-white">Latitude:</span>{" "}
              {user.latitude ?? "-"}
            </p>
            <p>
              <span className="font-medium text-white">Longitude:</span>{" "}
              {user.longitude ?? "-"}
            </p>
            <p className="md:col-span-2">
              <span className="font-medium text-white">Roles:</span>{" "}
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