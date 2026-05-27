"use client";

import type { UserResponseDto } from "../../api/user-assign/types";
import StatusBadge from "./StatusBadge";
import type { AssignmentTranslations } from "./assignmentLang";
import { getStatusLabel } from "./assignmentLang";
import { cn } from "./utils";

type Props = {
  isMotherSide: boolean;
  isMidwife: boolean;
  assignedMidwife: UserResponseDto | null;
  assignedUsers: UserResponseDto[];
  onViewUserDetails: (user: UserResponseDto, status: string) => void;
  onCancelAssignedMidwife: () => void;
  onCancelAssignedMother: (motherUserId: number) => void;
  assignmentActionLoadingId?: number | "midwife" | null;
  theme: "light" | "dark";
  labels: AssignmentTranslations;
};

export default function AssignmentSection({
  isMotherSide,
  isMidwife,
  assignedMidwife,
  assignedUsers,
  onViewUserDetails,
  onCancelAssignedMidwife,
  onCancelAssignedMother,
  assignmentActionLoadingId,
  theme,
  labels,
}: Props) {
  const isLightTheme = theme === "light";

  return (
    <section>
      <h2
        className={cn(
          "mb-1 text-md font-semibold",
          isLightTheme ? "text-gray-900" : "text-white"
        )}
      >
        {labels.assignment.myAssignment}
      </h2>

      {isMotherSide ? (
        assignedMidwife ? (
          <div
            className={cn(
              "rounded-md border p-4",
              isLightTheme
                ? "border-gray-200 bg-white shadow-sm"
                : "border-white/10 bg-white/5"
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p
                  className={cn(
                    "font-semibold",
                    isLightTheme ? "text-gray-900 text-sm" : "text-white text-xs"
                  )}
                >
                  {assignedMidwife.firstName} {assignedMidwife.lastName}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isLightTheme ? "text-gray-600 text-sm" : "text-gray-400 text-xs"
                  )}
                >
                  {assignedMidwife.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status="ASSIGNED" label={getStatusLabel("ASSIGNED", labels)} />
                <button
                  type="button"
                  onClick={() => onCancelAssignedMidwife()}
                  disabled={assignmentActionLoadingId === "midwife"}
                  className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {labels.assignment.cancelAssignment}
                </button>
                <button
                  type="button"
                  onClick={() => onViewUserDetails(assignedMidwife, "ASSIGNED")}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm",
                    isLightTheme
                      ? "border-black text-black hover:bg-gray-200"
                      : "border-white/10 text-gray-300 hover:bg-white/10"
                  )}
                  aria-label={labels.common.view}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className={cn("text-sm", isLightTheme ? "text-gray-600" : "text-gray-400")}>
            {labels.assignment.noMidwifeAssigned}
          </p>
        )
      ) : isMidwife ? (
        <div>
          <p className={cn("mb-4 text-xs", isLightTheme ? "text-gray-600" : "text-gray-400")}>
            {labels.assignment.totalAssignedUsers}: {assignedUsers.length}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {assignedUsers.length === 0 ? (
              <p className={cn("text-xs", isLightTheme ? "text-gray-600" : "text-gray-400")}>
                {labels.assignment.noUsersAssigned}
              </p>
            ) : (
              assignedUsers.map((user) => (
                <div
                  key={user.id}
                  className={cn(
                    "rounded-md border p-4",
                    isLightTheme
                      ? "border-gray-200 bg-white shadow-sm"
                      : "border-white/10 bg-white/5"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p
                        className={cn(
                          "text-xs font-semibold",
                          isLightTheme ? "text-gray-900" : "text-white"
                        )}
                      >
                        {user.firstName} {user.lastName}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isLightTheme ? "text-gray-600" : "text-gray-400"
                        )}
                      >
                        {user.email}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status="ASSIGNED" label={getStatusLabel("ASSIGNED", labels)} />
                      <button
                        type="button"
                        onClick={() => onCancelAssignedMother(user.id)}
                        disabled={assignmentActionLoadingId === user.id}
                        className="rounded-md bg-red-600 px-3 py-2 text-xs text-white hover:bg-red-500 disabled:opacity-50"
                      >
                        {labels.common.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={() => onViewUserDetails(user, "ASSIGNED")}
                        className={cn(
                          "rounded-md border px-3 py-2 text-xs",
                          isLightTheme
                            ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                            : "border-white/10 text-gray-300 hover:bg-white/10"
                        )}
                        aria-label={labels.common.view}
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
        <p className={cn("text-xs", isLightTheme ? "text-gray-600" : "text-gray-400")}>
          {labels.assignment.noAssignmentView}
        </p>
      )}
    </section>
  );
}
