"use client";

import type { ConnectionRequestResponseDto } from "../../api/user-assign/types";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "./utils";

type Props = {
  request: ConnectionRequestResponseDto | null;
  open: boolean;
  onClose: () => void;
  type: "received" | "sent";
  onApprove?: (requestId: number) => void;
  onReject?: (requestId: number) => void;
  actionLoadingId?: number | null;
};

export default function RequestDetailsModal({
  request,
  open,
  onClose,
  type,
  onApprove,
  onReject,
  actionLoadingId,
}: Props) {
  if (!request) return null;

  const name =
    type === "received"
      ? `${request.senderFirstName} ${request.senderLastName}`
      : `${request.receiverFirstName} ${request.receiverLastName}`;

  const email =
    type === "received" ? request.senderEmail : request.receiverEmail;

  return (
    <Modal open={open} title="Request Details" onClose={onClose}>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-md font-semibold text-white">{name}</p>
            <p className="text-xs text-gray-400">{email}</p>
          </div>

          <StatusBadge status={request.status} />
        </div>

        <div className="mt-3 grid gap-1 text-xs text-gray-300 md:grid-cols-2">
          <p>
            <span className="font-medium text-white">Method:</span>{" "}
            {request.method}
          </p>
          <p>
            <span className="font-medium text-white">Matched Area:</span>{" "}
            {request.matchedArea || "-"}
          </p>
          <p>
            <span className="font-medium text-white">Created:</span>{" "}
            {formatDateTime(request.createdAt)}
          </p>
          <p>
            <span className="font-medium text-white">Responded:</span>{" "}
            {formatDateTime(request.respondedAt)}
          </p>
          <p className="md:col-span-2">
            <span className="font-medium text-white">Message:</span>{" "}
            {request.message || "-"}
          </p>
        </div>

        {type === "received" && request.status === "PENDING" ? (
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => onApprove?.(request.id)}
              disabled={actionLoadingId === request.id}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onReject?.(request.id)}
              disabled={actionLoadingId === request.id}
              className="rounded-2xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}