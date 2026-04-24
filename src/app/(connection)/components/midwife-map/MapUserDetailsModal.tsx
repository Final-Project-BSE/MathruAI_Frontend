"use client";

import type { MapUserResponseDto } from "../../../api/user-assign/types";
import Modal from "..//Modal";

type Status = "AVAILABLE" | "PENDING" | "ASSIGNED";

type Props = {
  open: boolean;
  onClose: () => void;
  user: MapUserResponseDto | null;
  status: Status;
  mode: "patient-midwives" | "midwife-patients";
  onSendRequest: (user: MapUserResponseDto) => void;
  sendingUserId: number | null;
};

function badgeClass(status: Status) {
  if (status === "PENDING") return "bg-yellow-500/15 text-yellow-300";
  if (status === "ASSIGNED") return "bg-emerald-500/15 text-emerald-300";
  return "bg-blue-500/15 text-blue-300";
}

export default function MapUserDetailsModal({
  open,
  onClose,
  user,
  status,
  mode,
  onSendRequest,
  sendingUserId,
}: Props) {
  if (!user) return null;

  const canSend = status === "AVAILABLE";

  return (
    <Modal open={open} title="Location Details" onClose={onClose} theme="light">
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass(status)}`}>
            {status}
          </span>
        </div>

        <div className="grid gap-2 text-xs text-gray-700 md:grid-cols-2">
          <p>
            <span className="font-medium text-gray-900">Address:</span>{" "}
            {user.address || "-"}
          </p>
          <p>
            <span className="font-medium text-gray-900">Area:</span>{" "}
            {user.area || "-"}
          </p>
          <p>
            <span className="font-medium text-gray-900">District:</span>{" "}
            {user.district || "-"}
          </p>
          <p>
            <span className="font-medium text-gray-900">MOH Area:</span>{" "}
            {user.mohArea || "-"}
          </p>
          <p>
            <span className="font-medium text-gray-900">Latitude:</span>{" "}
            {user.latitude ?? "-"}
          </p>
          <p>
            <span className="font-medium text-gray-900">Longitude:</span>{" "}
            {user.longitude ?? "-"}
          </p>

          {mode === "patient-midwives" ? (
            <p className="md:col-span-2">
              <span className="font-medium text-gray-900">Midwife Name:</span>{" "}
              {user.firstName} {user.lastName}
            </p>
          ) : (
            <p className="md:col-span-2">
              <span className="font-medium text-gray-900">Assigned Midwife:</span>{" "}
              {user.assignedMidwifeName || "-"}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSendRequest(user)}
          disabled={!canSend || sendingUserId === user.id}
          className="rounded-lg bg-[#d04f51] px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {sendingUserId === user.id ? "Sending..." : "Send Request"}
        </button>
      </div>
    </Modal>
  );
}