"use client";

import type { MapUserResponseDto } from "../../../api/user-assign/types";
import Modal from "../Modal";
import type { AssignmentTranslations } from "../assignmentLang";
import { getStatusLabel } from "../assignmentLang";

type Status = "AVAILABLE" | "PENDING" | "ASSIGNED";

type Props = {
  open: boolean;
  onClose: () => void;
  user: MapUserResponseDto | null;
  status: Status;
  mode: "patient-midwives" | "midwife-patients";
  onSendRequest: (user: MapUserResponseDto) => void;
  sendingUserId: number | null;
  labels: AssignmentTranslations;
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
  labels,
}: Props) {
  if (!user) return null;

  const canSend = status === "AVAILABLE";

  return (
    <Modal
      open={open}
      title={labels.details.locationDetails}
      onClose={onClose}
      theme="light"
      closeLabel={labels.common.close}
    >
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass(status)}`}>
            {getStatusLabel(status, labels)}
          </span>
        </div>

        <div className="grid gap-2 text-xs text-gray-700 md:grid-cols-2">
          <p>
            <span className="font-medium text-gray-900">{labels.common.address}:</span>{" "}
            {user.address || labels.common.unavailable}
          </p>
          <p>
            <span className="font-medium text-gray-900">{labels.common.area}:</span>{" "}
            {user.area || labels.common.unavailable}
          </p>
          <p>
            <span className="font-medium text-gray-900">{labels.common.district}:</span>{" "}
            {user.district || labels.common.unavailable}
          </p>
          <p>
            <span className="font-medium text-gray-900">{labels.common.mohArea}:</span>{" "}
            {user.mohArea || labels.common.unavailable}
          </p>
          <p>
            <span className="font-medium text-gray-900">{labels.common.latitude}:</span>{" "}
            {user.latitude ?? labels.common.unavailable}
          </p>
          <p>
            <span className="font-medium text-gray-900">{labels.common.longitude}:</span>{" "}
            {user.longitude ?? labels.common.unavailable}
          </p>

          {mode === "patient-midwives" ? (
            <p className="md:col-span-2">
              <span className="font-medium text-gray-900">{labels.details.midwifeName}:</span>{" "}
              {user.firstName} {user.lastName}
            </p>
          ) : (
            <p className="md:col-span-2">
              <span className="font-medium text-gray-900">{labels.details.assignedMidwife}:</span>{" "}
              {user.assignedMidwifeName || labels.common.unavailable}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSendRequest(user)}
          disabled={!canSend || sendingUserId === user.id}
          className="rounded-lg bg-[#d04f51] px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {sendingUserId === user.id ? labels.common.sending : labels.common.sendRequest}
        </button>
      </div>
    </Modal>
  );
}
