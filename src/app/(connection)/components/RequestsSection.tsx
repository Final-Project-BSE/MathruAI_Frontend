"use client";

import type { ConnectionRequestResponseDto } from "../../api/user-assign/types";
import StatusBadge from "./StatusBadge";

type Props = {
  loading: boolean;
  receivedRequests: ConnectionRequestResponseDto[];
  sentRequests: ConnectionRequestResponseDto[];
  onViewRequest: (
    request: ConnectionRequestResponseDto,
    type: "received" | "sent"
  ) => void;
};

export default function RequestsSection({
  loading,
  receivedRequests,
  sentRequests,
  onViewRequest,
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-xl">
        <h2 className="mb-4 text-md font-semibold">Received Requests</h2>

        {loading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : receivedRequests.length === 0 ? (
          <p className="text-xs text-gray-400">No received requests.</p>
        ) : (
          <div className="space-y-3">
            {receivedRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-md border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white text-xs">
                      {req.senderFirstName} {req.senderLastName}
                    </p>
                    <p className="text-xs text-gray-400">{req.senderEmail}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.status} />
                    <button
                      type="button"
                      onClick={() => onViewRequest(req, "received")}
                      className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-xl">
        <h2 className="mb-4 text-md font-semibold">Sent Requests</h2>

        {loading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : sentRequests.length === 0 ? (
          <p className="text-xs text-gray-400">No sent requests.</p>
        ) : (
          <div className="space-y-3">
            {sentRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-md border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white text-xs">
                      {req.receiverFirstName} {req.receiverLastName}
                    </p>
                    <p className="text-xs text-gray-400">{req.receiverEmail}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.status} />
                    <button
                      type="button"
                      onClick={() => onViewRequest(req, "sent")}
                      className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}