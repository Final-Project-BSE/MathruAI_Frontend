"use client";

import type { ConnectionRequestResponseDto } from "../../api/user-assign/types";
import StatusBadge from "./StatusBadge";
import type { AssignmentTranslations } from "./assignmentLang";
import { getStatusLabel } from "./assignmentLang";
import { cn } from "./utils";

type Props = {
  loading: boolean;
  receivedRequests: ConnectionRequestResponseDto[];
  sentRequests: ConnectionRequestResponseDto[];
  onViewRequest: (
    request: ConnectionRequestResponseDto,
    type: "received" | "sent"
  ) => void;
  onRejectRequest: (requestId: number) => void;
  onCancelSentRequest: (requestId: number) => void;
  actionLoadingId?: number | null;
  theme: "light" | "dark";
  labels: AssignmentTranslations;
};

export default function RequestsSection({
  loading,
  receivedRequests,
  sentRequests,
  onViewRequest,
  onRejectRequest,
  onCancelSentRequest,
  actionLoadingId,
  theme,
  labels,
}: Props) {
  const isLightTheme = theme === "light";

  const sectionClass = cn(
    "rounded-lg border p-5 shadow-xl",
    isLightTheme ? "border-gray-200 bg-white" : "border-white/10 bg-zinc-950"
  );

  const cardClass = cn(
    "rounded-md border p-4",
    isLightTheme ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"
  );

  const titleClass = cn("mb-4 text-md font-semibold", isLightTheme ? "text-gray-900" : "text-white");
  const mutedClass = cn("text-xs", isLightTheme ? "text-gray-600" : "text-gray-400");
  const nameClass = cn("font-semibold text-xs", isLightTheme ? "text-gray-900" : "text-white");
  const actionClass = cn(
    "rounded-md border px-3 py-2 text-xs",
    isLightTheme
      ? "border-gray-200 text-gray-700 hover:bg-gray-100"
      : "border-white/10 text-gray-300 hover:bg-white/10"
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={sectionClass}>
        <h2 className={titleClass}>{labels.requests.receivedRequests}</h2>

        {loading ? (
          <p className={mutedClass}>{labels.common.loading}</p>
        ) : receivedRequests.length === 0 ? (
          <p className={mutedClass}>{labels.requests.noReceivedRequests}</p>
        ) : (
          <div className="space-y-3">
            {receivedRequests.map((req) => {
              const isPending = req.status === "PENDING";
              const isLoading = actionLoadingId === req.id;

              return (
                <div key={req.id} className={cardClass}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className={nameClass}>
                        {req.senderFirstName} {req.senderLastName}
                      </p>
                      <p className={mutedClass}>{req.senderEmail}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        status={req.status}
                        label={getStatusLabel(req.status, labels)}
                      />
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => onRejectRequest(req.id)}
                          disabled={isLoading}
                          className="rounded-md bg-red-600 px-3 py-2 text-xs text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          {labels.common.reject}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onViewRequest(req, "received")}
                        className={actionClass}
                        aria-label={labels.common.view}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className={sectionClass}>
        <h2 className={titleClass}>{labels.requests.sentRequests}</h2>

        {loading ? (
          <p className={mutedClass}>{labels.common.loading}</p>
        ) : sentRequests.length === 0 ? (
          <p className={mutedClass}>{labels.requests.noSentRequests}</p>
        ) : (
          <div className="space-y-3">
            {sentRequests.map((req) => {
              const isPending = req.status === "PENDING";
              const isLoading = actionLoadingId === req.id;

              return (
                <div key={req.id} className={cardClass}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className={nameClass}>
                        {req.receiverFirstName} {req.receiverLastName}
                      </p>
                      <p className={mutedClass}>{req.receiverEmail}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        status={req.status}
                        label={getStatusLabel(req.status, labels)}
                      />
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => onCancelSentRequest(req.id)}
                          disabled={isLoading}
                          className="rounded-md bg-red-600 px-3 py-2 text-xs text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          {labels.common.cancel}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onViewRequest(req, "sent")}
                        className={actionClass}
                        aria-label={labels.common.view}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
