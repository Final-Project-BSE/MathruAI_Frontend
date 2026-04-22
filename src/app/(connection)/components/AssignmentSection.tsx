"use client";

import type { UserResponseDto } from "../../api/user-assign/types";
import StatusBadge from "./StatusBadge";

type Props = {
  isMotherSide: boolean;
  isMidwife: boolean;
  assignedMidwife: UserResponseDto | null;
  assignedUsers: UserResponseDto[];
  onViewUserDetails: (user: UserResponseDto, status: string) => void;
};

export default function AssignmentSection({
  isMotherSide,
  isMidwife,
  assignedMidwife,
  assignedUsers,
  onViewUserDetails,
}: Props) {
  return (
    <section className="">
      <h2 className="mb-1 text-md font-semibold">My Assignment</h2>

      {isMotherSide ? (
        assignedMidwife ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">
                  {assignedMidwife.firstName} {assignedMidwife.lastName}
                </p>
                <p className="text-sm text-gray-400">{assignedMidwife.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status="ASSIGNED" />
                <button
                  type="button"
                  onClick={() => onViewUserDetails(assignedMidwife, "ASSIGNED")}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-300 hover:bg-white/10"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No midwife assigned yet.</p>
        )
      ) : isMidwife ? (
        <div>
          <p className="mb-4 text-xs text-gray-400">
            Total assigned users: {assignedUsers.length}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {assignedUsers.length === 0 ? (
              <p className="text-xs text-gray-400">No users assigned yet.</p>
            ) : (
              assignedUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-md border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white text-xs">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status="ASSIGNED" />
                      <button
                        type="button"
                        onClick={() => onViewUserDetails(user, "ASSIGNED")}
                        className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400">No assignment view available.</p>
      )}
    </section>
  );
}