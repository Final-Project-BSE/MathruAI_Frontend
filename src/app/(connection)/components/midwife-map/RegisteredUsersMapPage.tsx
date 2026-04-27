"use client";

import { useEffect, useMemo, useState } from "react";
import { assignmentApi } from "../../../api/user-assign/api";
import type {
  ConnectionRequestResponseDto,
  MapUserResponseDto,
  Role,
  UserResponseDto,
} from "../../../api/user-assign/types";
import GlobalUsersMap from "./GlobalUsersMap";
import MapUserDetailsModal from "./MapUserDetailsModal";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { useAutoDismiss } from "../../../../components/common/useAutoDismiss";

type Mode = "patient-midwives" | "midwife-patients";
type Status = "AVAILABLE" | "PENDING" | "ASSIGNED";

type Props = {
  userId: number;
  token: string;
  roles: Role[];
  mode: Mode;
};

const MOTHER_ROLES: Role[] = [
  "HOPE_TO_PREGNANT_MOTHER",
  "PREGNANT_MOTHER",
  "POST_PREGNANT_MOTHER",
];

function hasMidwifeRole(roles: Role[]) {
  return roles.includes("MIDWIFE");
}

function hasMotherRole(roles: Role[]) {
  return roles.some((role) => MOTHER_ROLES.includes(role));
}

export default function RegisteredUsersMapPage({
  userId,
  token,
  roles,
  mode,
}: Props) {
  const isMidwife = useMemo(() => hasMidwifeRole(roles), [roles]);
  const isMotherSide = useMemo(() => hasMotherRole(roles), [roles]);

  const [users, setUsers] = useState<MapUserResponseDto[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequestResponseDto[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequestResponseDto[]>([]);
  const [assignedMidwife, setAssignedMidwife] = useState<UserResponseDto | null>(null);

  const [loading, setLoading] = useState(false);
  const [sendingUserId, setSendingUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<MapUserResponseDto | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const visibleError = useAutoDismiss(error, 5000);
  const visibleSuccess = useAutoDismiss(success, 5000);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [allUsers, sent, received] = await Promise.all([
        assignmentApi.getAllMappableOppositeUsers(userId, token),
        assignmentApi.getSentRequests(userId, token),
        assignmentApi.getReceivedRequests(userId, token),
      ]);

      setUsers(allUsers);
      setSentRequests(sent);
      setReceivedRequests(received);

      if (isMotherSide) {
        try {
          const myAssignedMidwife = await assignmentApi.getAssignedMidwifeForMother(
            userId,
            token
          );
          setAssignedMidwife(myAssignedMidwife);
        } catch {
          setAssignedMidwife(null);
        }
      } else {
        setAssignedMidwife(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load map data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [userId, token, isMotherSide]);

  function getStatus(user: MapUserResponseDto): Status {
    const hasPending =
      sentRequests.some(
        (req) => req.receiverId === user.id && req.status === "PENDING"
      ) ||
      receivedRequests.some(
        (req) => req.senderId === user.id && req.status === "PENDING"
      );

    if (hasPending) return "PENDING";

    if (mode === "patient-midwives") {
      if (assignedMidwife?.id === user.id) return "ASSIGNED";
      return "AVAILABLE";
    }

    if (mode === "midwife-patients") {
      if (user.assignedMidwifeId != null) return "ASSIGNED";
      return "AVAILABLE";
    }

    return "AVAILABLE";
  }

  async function handleSendRequest(user: MapUserResponseDto) {
    try {
      if (getStatus(user) !== "AVAILABLE") {
        throw new Error("Request cannot be sent for this user.");
      }

      setSendingUserId(user.id);
      setError("");
      setSuccess("");

      const created = await assignmentApi.sendRequest(
        userId,
        {
          method: "EMAIL",
          targetEmail: user.email,
          message:
            mode === "patient-midwives"
              ? `Connection request sent to midwife ${user.firstName} ${user.lastName}`
              : `Connection request sent to patient ${user.firstName} ${user.lastName}`,
        },
        token
      );

      setSuccess(`Created ${created.length} request(s) successfully.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request");
    } finally {
      setSendingUserId(null);
    }
  }

  const shouldShow = !isMidwife;

  const title =
    mode === "patient-midwives"
      ? "All Registered Midwives on Map"
      : "";

  const subtitle =
    mode === "patient-midwives"
      ? "Patients can view every registered midwife with map location details and send requests."
      : "";

  return (
    <div className={isMidwife ? "min-h-screen bg-black text-white" : "min-h-screen bg-[#fed2cc] text-black"}>
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {!isMidwife && (
          <>
            <div className="mb-6">
              <h1
                className={`text-2xl font-bold ${isMidwife ? "text-white" : "text-gray-900"
                  }`}
              >
                {title}
              </h1>

              {shouldShow && (
                <p
                  className={`mt-2 text-sm ${isMidwife ? "text-gray-400" : "text-gray-700"
                    }`}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {visibleError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {visibleError}
              </div>
            )}

            {visibleSuccess && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {visibleSuccess}
              </div>
            )}
          </>
        )}

        <section className={`rounded-xl border p-5 shadow-xl ${isMidwife ? "border-white/10 bg-zinc-950" : "border-gray-200 bg-white"}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className={`text-lg font-semibold ${isMidwife ? "text-white text-sm" : "text-gray-900"}`}>
                Map View
              </h2>
              <p className={`text-sm ${isMidwife ? "text-gray-400 text-xs" : "text-gray-600"}`}>
                Click a marker to view address, district, MOH area and send a request.
              </p>
            </div>

            <div className={`text-sm ${isMidwife ? "text-gray-300 text-xs" : "text-gray-700"}`}>
              Total users on map: {users.length}
            </div>
          </div>

          {loading ? (
            <p className={isMidwife ? "text-sm text-gray-400" : "text-sm text-gray-600"}>
              Loading map...
            </p>
          ) : users.length === 0 ? (
            <p className={isMidwife ? "text-sm text-gray-400" : "text-sm text-gray-600"}>
              No users with saved coordinates were found.
            </p>
          ) : (
            <GlobalUsersMap
              users={users}
              getStatus={getStatus}
              sendingUserId={sendingUserId}
              onSendRequest={handleSendRequest}
              onViewDetails={setSelectedUser}
              mode={mode}
            />
          )}
        </section>

        <MapUserDetailsModal
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          status={selectedUser ? getStatus(selectedUser) : "AVAILABLE"}
          mode={mode}
          onSendRequest={handleSendRequest}
          sendingUserId={sendingUserId}
        />
      </div>
    </div>
  );
}