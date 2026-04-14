"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { assignmentApi } from "../../api/user-assign/api";
import type {
  AreaMapSearchRequestDto,
  AreaSearchRequestDto,
  AssignedUserProfileUpdateRequestDto,
  ConnectionRequestMethod,
  ConnectionRequestResponseDto,
  Role,
  UserResponseDto,
} from "../../api/user-assign/types";

const AreaUserMap = dynamic(
  () => import("./AreaUserMap"),
  { ssr: false }
);

type Props = {
  userId: number;
  token: string;
  roles: Role[];
};

const motherRoles: Role[] = [
  "HOPE_TO_PREGNANT_MOTHER",
  "PREGNANT_MOTHER",
  "POST_PREGNANT_MOTHER",
];

function hasMidwifeRole(roles: Role[]) {
  return roles.includes("MIDWIFE");
}

function hasMotherRole(roles: Role[]) {
  return roles.some((role) => motherRoles.includes(role));
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function getReadableRoleLabel(roles: Role[]) {
  if (roles.includes("MIDWIFE")) return "Midwife";
  if (roles.includes("PREGNANT_MOTHER")) return "Pregnant Mother";
  if (roles.includes("POST_PREGNANT_MOTHER")) return "Post Pregnant Mother";
  if (roles.includes("HOPE_TO_PREGNANT_MOTHER")) return "Hope To Pregnant Mother";
  return roles.join(", ");
}

export default function Assignment({
  userId,
  token,
  roles,
}: Props): JSX.Element {
  const isMidwife = useMemo(() => hasMidwifeRole(roles), [roles]);
  const isMotherSide = useMemo(() => hasMotherRole(roles), [roles]);

  const [method, setMethod] = useState<ConnectionRequestMethod>("EMAIL");
  const [targetEmail, setTargetEmail] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [message, setMessage] = useState("");

  const [sentRequests, setSentRequests] = useState<ConnectionRequestResponseDto[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequestResponseDto[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<UserResponseDto[]>([]);
  const [assignedMidwife, setAssignedMidwife] = useState<UserResponseDto | null>(null);

  const [selectedMotherId, setSelectedMotherId] = useState<number | "">("");
  const [updateForm, setUpdateForm] = useState<AssignedUserProfileUpdateRequestDto>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    area: "",
    district: "",
    mohArea: "",
    latitude: undefined,
    longitude: undefined,
  });

  const [searchForm, setSearchForm] = useState<AreaSearchRequestDto>({
    district: "",
    mohArea: "",
  });

  const [mapSearchForm, setMapSearchForm] = useState<AreaMapSearchRequestDto>({
    district: "",
    mohArea: "",
  });

  const [searchResults, setSearchResults] = useState<UserResponseDto[]>([]);
  const [mapUsers, setMapUsers] = useState<UserResponseDto[]>([]);

  const [searching, setSearching] = useState(false);
  const [mapSearching, setMapSearching] = useState(false);

  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [sendingSearchUserId, setSendingSearchUserId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [sent, received] = await Promise.all([
        assignmentApi.getSentRequests(userId, token),
        assignmentApi.getReceivedRequests(userId, token),
      ]);

      setSentRequests(sent);
      setReceivedRequests(received);

      if (isMidwife) {
        const users = await assignmentApi.getAssignedUsersForMidwife(userId, token);
        setAssignedUsers(users);
      }

      if (isMotherSide) {
        try {
          const midwife = await assignmentApi.getAssignedMidwifeForMother(userId, token);
          setAssignedMidwife(midwife);
        } catch {
          setAssignedMidwife(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [userId, token, isMidwife, isMotherSide]);

  async function handleSendRequest(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      if (method === "EMAIL" && !targetEmail.trim()) {
        throw new Error("Target email is required.");
      }

      if (method === "AREA" && !targetArea.trim()) {
        throw new Error("Target area is required.");
      }

      const created = await assignmentApi.sendRequest(
        userId,
        {
          method,
          targetEmail: method === "EMAIL" ? targetEmail.trim() : undefined,
          targetArea: method === "AREA" ? targetArea.trim() : undefined,
          message: message.trim() || undefined,
        },
        token
      );

      setSuccess(`Created ${created.length} request(s) successfully.`);
      setTargetEmail("");
      setTargetArea("");
      setMessage("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request");
    }
  }

  async function handleSearchUsers(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSearching(true);
      setError("");
      setSuccess("");

      if (!searchForm.district.trim()) {
        throw new Error("District is required.");
      }

      if (!searchForm.mohArea.trim()) {
        throw new Error("MOH area is required.");
      }

      const results = await assignmentApi.searchUsersByDistrictAndMohArea(
        userId,
        {
          district: searchForm.district.trim(),
          mohArea: searchForm.mohArea.trim(),
        },
        token
      );

      setSearchResults(results);
      setSuccess(`Found ${results.length} user(s).`);
    } catch (err) {
      setSearchResults([]);
      setError(err instanceof Error ? err.message : "Failed to search users");
    } finally {
      setSearching(false);
    }
  }

  async function handleMapSearchUsers(e: React.FormEvent) {
    e.preventDefault();

    try {
      setMapSearching(true);
      setError("");
      setSuccess("");

      if (!mapSearchForm.district.trim()) {
        throw new Error("District is required.");
      }

      if (!mapSearchForm.mohArea.trim()) {
        throw new Error("MOH area is required.");
      }

      const results = await assignmentApi.searchMappableUsersByDistrictAndMohArea(
        userId,
        {
          district: mapSearchForm.district.trim(),
          mohArea: mapSearchForm.mohArea.trim(),
        },
        token
      );

      setMapUsers(results);
      setSuccess(`Found ${results.length} mappable user(s).`);
    } catch (err) {
      setMapUsers([]);
      setError(err instanceof Error ? err.message : "Failed to search map users");
    } finally {
      setMapSearching(false);
    }
  }

  async function handleSendRequestToSearchedUser(receiver: UserResponseDto) {
    try {
      setSendingSearchUserId(receiver.id);
      setError("");
      setSuccess("");

      const created = await assignmentApi.sendRequest(
        userId,
        {
          method: "EMAIL",
          targetEmail: receiver.email,
          message: `Connection request sent to ${receiver.firstName} ${receiver.lastName}`,
        },
        token
      );

      setSuccess(`Created ${created.length} request(s) successfully.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request");
    } finally {
      setSendingSearchUserId(null);
    }
  }

  async function handleApprove(requestId: number) {
    try {
      setActionLoadingId(requestId);
      setError("");
      setSuccess("");

      await assignmentApi.approveRequest(requestId, userId, token);
      setSuccess("Request approved successfully.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve request");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleReject(requestId: number) {
    try {
      setActionLoadingId(requestId);
      setError("");
      setSuccess("");

      await assignmentApi.rejectRequest(requestId, userId, token);
      setSuccess("Request rejected successfully.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject request");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleUpdateAssignedMother(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedMotherId) {
      setError("Select an assigned user first.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const payload: AssignedUserProfileUpdateRequestDto = {
        firstName: updateForm.firstName?.trim() || undefined,
        lastName: updateForm.lastName?.trim() || undefined,
        phoneNumber: updateForm.phoneNumber?.trim() || undefined,
        address: updateForm.address?.trim() || undefined,
        area: updateForm.area?.trim() || undefined,
        district: updateForm.district?.trim() || undefined,
        mohArea: updateForm.mohArea?.trim() || undefined,
        latitude: updateForm.latitude,
        longitude: updateForm.longitude,
      };

      await assignmentApi.updateAssignedMotherProfile(
        userId,
        Number(selectedMotherId),
        payload,
        token
      );

      setSuccess("Assigned user's profile updated successfully.");
      setUpdateForm({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        area: "",
        district: "",
        mohArea: "",
        latitude: undefined,
        longitude: undefined,
      });
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update assigned user"
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Assignment & Connection Requests</h1>
        <p className="mt-1 text-sm text-gray-600">
          Search users by district and MOH area, display them on a map, send requests, review incoming requests, and manage assignments.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      <section className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          {isMidwife
            ? "Search Mothers by District & MOH Area"
            : isMotherSide
            ? "Search Midwives by District & MOH Area"
            : "Search Users"}
        </h2>

        <form onSubmit={handleSearchUsers} className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="District"
            value={searchForm.district}
            onChange={(e) =>
              setSearchForm((prev) => ({
                ...prev,
                district: e.target.value,
              }))
            }
            className="rounded-xl border px-3 py-2 outline-none focus:ring"
          />

          <input
            type="text"
            placeholder="MOH Area"
            value={searchForm.mohArea}
            onChange={(e) =>
              setSearchForm((prev) => ({
                ...prev,
                mohArea: e.target.value,
              }))
            }
            className="rounded-xl border px-3 py-2 outline-none focus:ring"
          />

          <button
            type="submit"
            disabled={searching}
            className="rounded-xl bg-black px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="mt-5">
          {searchResults.length === 0 ? (
            <p className="text-sm text-gray-600">No searched users to display yet.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {searchResults.map((user) => (
                <div key={user.id} className="rounded-xl border p-4">
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="mt-2 text-sm text-gray-700">
                    <span className="font-medium">Role:</span>{" "}
                    {getReadableRoleLabel(user.roles)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">District:</span>{" "}
                    {user.district || "-"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">MOH Area:</span>{" "}
                    {user.mohArea || "-"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Area:</span>{" "}
                    {user.area || "-"}
                  </p>

                  <button
                    onClick={() => void handleSendRequestToSearchedUser(user)}
                    disabled={sendingSearchUserId === user.id}
                    className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {sendingSearchUserId === user.id
                      ? "Sending..."
                      : "Send Request"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          {isMidwife
            ? "Map of Mothers in Selected Area"
            : isMotherSide
            ? "Map of Midwives in Selected Area"
            : "Map Search"}
        </h2>

        <form onSubmit={handleMapSearchUsers} className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="District"
            value={mapSearchForm.district}
            onChange={(e) =>
              setMapSearchForm((prev) => ({
                ...prev,
                district: e.target.value,
              }))
            }
            className="rounded-xl border px-3 py-2 outline-none focus:ring"
          />

          <input
            type="text"
            placeholder="MOH Area"
            value={mapSearchForm.mohArea}
            onChange={(e) =>
              setMapSearchForm((prev) => ({
                ...prev,
                mohArea: e.target.value,
              }))
            }
            className="rounded-xl border px-3 py-2 outline-none focus:ring"
          />

          <button
            type="submit"
            disabled={mapSearching}
            className="rounded-xl bg-black px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {mapSearching ? "Loading Map..." : "Load Map"}
          </button>
        </form>

        <div className="mt-5">
          {mapUsers.length === 0 ? (
            <p className="text-sm text-gray-600">
              No mappable users found yet.
            </p>
          ) : (
            <AreaUserMap
              users={mapUsers}
              sendingUserId={sendingSearchUserId}
              onSendRequest={(user) => void handleSendRequestToSearchedUser(user)}
            />
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Manual Connection Request</h2>

          <form onSubmit={handleSendRequest} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Method</label>
              <select
                value={method}
                onChange={(e) =>
                  setMethod(e.target.value as ConnectionRequestMethod)
                }
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              >
                <option value="EMAIL">EMAIL</option>
                <option value="AREA">AREA</option>
              </select>
            </div>

            {method === "EMAIL" ? (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Target Email
                </label>
                <input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                />
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Target Area
                </label>
                <input
                  type="text"
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  placeholder="Colombo"
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Optional message"
                rows={4}
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-2 text-white transition hover:opacity-90"
            >
              Send Request
            </button>
          </form>
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">My Assignment</h2>

          {isMotherSide ? (
            assignedMidwife ? (
              <div className="rounded-xl border p-4">
                <p className="font-medium">
                  {assignedMidwife.firstName} {assignedMidwife.lastName}
                </p>
                <p className="text-sm text-gray-600">{assignedMidwife.email}</p>
                <p className="mt-2 text-sm">
                  <span className="font-medium">District:</span>{" "}
                  {assignedMidwife.district || "-"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">MOH Area:</span>{" "}
                  {assignedMidwife.mohArea || "-"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Area:</span>{" "}
                  {assignedMidwife.area || "-"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Latitude:</span>{" "}
                  {assignedMidwife.latitude ?? "-"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Longitude:</span>{" "}
                  {assignedMidwife.longitude ?? "-"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No midwife assigned yet.</p>
            )
          ) : isMidwife ? (
            <div>
              <p className="mb-3 text-sm text-gray-600">
                Total assigned users: {assignedUsers.length}
              </p>

              <div className="max-h-72 space-y-3 overflow-y-auto">
                {assignedUsers.length === 0 ? (
                  <p className="text-sm text-gray-600">No users assigned yet.</p>
                ) : (
                  assignedUsers.map((user) => (
                    <div key={user.id} className="rounded-xl border p-3">
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">
                        District: {user.district || "-"}
                      </p>
                      <p className="text-sm text-gray-600">
                        MOH Area: {user.mohArea || "-"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Area: {user.area || "-"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Latitude: {user.latitude ?? "-"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Longitude: {user.longitude ?? "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Roles: {user.roles.join(", ")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No assignment view available.</p>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Received Requests</h2>

          {loading ? (
            <p className="text-sm text-gray-600">Loading...</p>
          ) : receivedRequests.length === 0 ? (
            <p className="text-sm text-gray-600">No received requests.</p>
          ) : (
            <div className="space-y-3">
              {receivedRequests.map((req) => (
                <div key={req.id} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {req.senderFirstName} {req.senderLastName}
                      </p>
                      <p className="text-sm text-gray-600">{req.senderEmail}</p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        req.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-1 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Method:</span> {req.method}
                    </p>
                    <p>
                      <span className="font-medium">Matched Area:</span>{" "}
                      {req.matchedArea || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Message:</span>{" "}
                      {req.message || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {formatDateTime(req.createdAt)}
                    </p>
                  </div>

                  {req.status === "PENDING" ? (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => void handleApprove(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="rounded-xl bg-green-600 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => void handleReject(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Sent Requests</h2>

          {loading ? (
            <p className="text-sm text-gray-600">Loading...</p>
          ) : sentRequests.length === 0 ? (
            <p className="text-sm text-gray-600">No sent requests.</p>
          ) : (
            <div className="space-y-3">
              {sentRequests.map((req) => (
                <div key={req.id} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {req.receiverFirstName} {req.receiverLastName}
                      </p>
                      <p className="text-sm text-gray-600">{req.receiverEmail}</p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        req.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-1 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Method:</span> {req.method}
                    </p>
                    <p>
                      <span className="font-medium">Matched Area:</span>{" "}
                      {req.matchedArea || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Message:</span>{" "}
                      {req.message || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {formatDateTime(req.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium">Responded:</span>{" "}
                      {formatDateTime(req.respondedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {isMidwife ? (
        <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            Update Assigned Mother Profile
          </h2>

          <form onSubmit={handleUpdateAssignedMother} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Select Assigned User
              </label>
              <select
                value={selectedMotherId}
                onChange={(e) =>
                  setSelectedMotherId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              >
                <option value="">Choose assigned user</option>
                {assignedUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="First name"
                value={updateForm.firstName || ""}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                className="rounded-xl border px-3 py-2 outline-none focus:ring"
              />
              <input
                type="text"
                placeholder="Last name"
                value={updateForm.lastName || ""}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                className="rounded-xl border px-3 py-2 outline-none focus:ring"
              />
              <input
                type="text"
                placeholder="Phone number"
                value={updateForm.phoneNumber || ""}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className="rounded-xl border px-3 py-2 outline-none focus:ring"
              />
              <input
                type="text"
                placeholder="Area"
                value={updateForm.area || ""}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    area: e.target.value,
                  }))
                }
                className="rounded-xl border px-3 py-2 outline-none focus:ring"
              />
              <input
                type="text"
                placeholder="District"
                value={updateForm.district || ""}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    district: e.target.value,
                  }))
                }
                className="rounded-xl border px-3 py-2 outline-none focus:ring"
              />
              <input
                type="text"
                placeholder="MOH Area"
                value={updateForm.mohArea || ""}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    mohArea: e.target.value,
                  }))
                }
                className="rounded-xl border px-3 py-2 outline-none focus:ring"
              />
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={updateForm.latitude ?? ""}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    latitude:
                      e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
                className="rounded-xl border px-3 py-2 outline-none focus:ring"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={updateForm.longitude ?? ""}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    longitude:
                      e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
                className="rounded-xl border px-3 py-2 outline-none focus:ring"
              />
            </div>

            <textarea
              placeholder="Address"
              value={updateForm.address || ""}
              onChange={(e) =>
                setUpdateForm((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            />

            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-2 text-white transition hover:opacity-90"
            >
              Update Assigned User
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}