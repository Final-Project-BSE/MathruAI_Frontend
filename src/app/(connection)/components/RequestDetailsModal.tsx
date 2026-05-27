"use client";

import type { ConnectionRequestResponseDto } from "../../api/user-assign/types";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import type { AssignmentTranslations } from "./assignmentLang";
import { getStatusLabel } from "./assignmentLang";
import { cn, formatDateTime } from "./utils";

type Props = {
  request: ConnectionRequestResponseDto | null;
  open: boolean;
  onClose: () => void;
  type: "received" | "sent";
  onApprove?: (requestId: number) => void;
  onReject?: (requestId: number) => void;
  onCancel?: (requestId: number) => void;
  actionLoadingId?: number | null;
  theme: "light" | "dark";
  labels: AssignmentTranslations;
};

export default function RequestDetailsModal({
  request,
  open,
  onClose,
  type,
  onApprove,
  onReject,
  onCancel,
  actionLoadingId,
  theme,
  labels,
}: Props) {
  if (!request) return null;

  const isLightTheme = theme === "light";

  const name =
    type === "received"
      ? `${request.senderFirstName} ${request.senderLastName}`
      : `${request.receiverFirstName} ${request.receiverLastName}`;

  const email =
    type === "received" ? request.senderEmail : request.receiverEmail;

  const isPending = request.status === "PENDING";
  const isLoading = actionLoadingId === request.id;

  return (
    <Modal
      open={open}
      title={labels.requests.requestDetails}
      onClose={onClose}
      theme={theme}
      closeLabel={labels.common.close}
    >
      <div
        className={cn(
          "rounded-lg border p-4",
          isLightTheme
            ? "border-gray-200 bg-gray-50"
            : "border-white/10 bg-white/5"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p
              className={cn(
                "text-md font-semibold",
                isLightTheme ? "text-gray-900" : "text-white"
              )}
            >
              {name}
            </p>
            <p className={cn("text-xs", isLightTheme ? "text-gray-600" : "text-gray-400")}>
              {email}
            </p>
          </div>

          <StatusBadge
            status={request.status}
            label={getStatusLabel(request.status, labels)}
          />
        </div>

        <div
          className={cn(
            "mt-3 grid gap-1 text-xs md:grid-cols-2",
            isLightTheme ? "text-gray-700" : "text-gray-300"
          )}
        >
          <p>
            <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
              {labels.common.method}:
            </span>{" "}
            {request.method}
          </p>
          <p>
            <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
              {labels.requests.matchedArea}:
            </span>{" "}
            {request.matchedArea || labels.common.unavailable}
          </p>
          <p>
            <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
              {labels.common.created}:
            </span>{" "}
            {formatDateTime(request.createdAt)}
          </p>
          <p>
            <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
              {labels.common.responded}:
            </span>{" "}
            {formatDateTime(request.respondedAt)}
          </p>
          <p className="md:col-span-2">
            <span className={cn("font-medium", isLightTheme ? "text-gray-900" : "text-white")}>
              {labels.common.message}:
            </span>{" "}
            {request.message || labels.common.unavailable}
          </p>
        </div>

        {type === "received" && isPending ? (
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => onApprove?.(request.id)}
              disabled={isLoading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {labels.common.approve}
            </button>
            <button
              type="button"
              onClick={() => onReject?.(request.id)}
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs text-white hover:bg-red-500 disabled:opacity-50"
            >
              {labels.common.reject}
            </button>
          </div>
        ) : null}

        {type === "sent" && isPending ? (
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => onCancel?.(request.id)}
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs text-white hover:bg-red-500 disabled:opacity-50"
            >
              {labels.requests.cancelRequest}
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
