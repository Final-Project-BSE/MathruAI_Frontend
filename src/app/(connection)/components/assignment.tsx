"use client";

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
import AssignmentPageHeader from "./AssignmentPageHeader";
import AssignmentSection from "./AssignmentSection";
import AssignmentTabs from "./AssignmentTabs";
import type { MainTab } from "./constants";
import RequestDetailsModal from "./RequestDetailsModal";
import RequestsSection from "./RequestsSection";
import SearchConnectSection from "./SearchConnectSection";
import UpdateAssignedMotherSection from "./UpdateAssignedMotherSection";
import UserDetailsModal from "./UserDetailsModal";
import { useAutoDismiss } from "../../../components/common/useAutoDismiss";
import { hasMidwifeRole, hasMotherRole } from "./utils";

type Props = {
  userId: number;
  token: string;
  roles: Role[];
};

export default function Assignment({
  userId,
  token,
  roles,
}: Props): JSX.Element {
  const isMidwife = useMemo(() => hasMidwifeRole(roles), [roles]);
  const isMotherSide = useMemo(() => hasMotherRole(roles), [roles]);

  const [activeTab, setActiveTab] = useState<MainTab>("search-connect");

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

  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [searchMohAreaOptions, setSearchMohAreaOptions] = useState<string[]>([]);
  const [mapMohAreaOptions, setMapMohAreaOptions] = useState<string[]>([]);

  const [searchResults, setSearchResults] = useState<UserResponseDto[]>([]);
  const [mapUsers, setMapUsers] = useState<UserResponseDto[]>([]);

  const [searching, setSearching] = useState(false);
  const [mapSearching, setMapSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [sendingSearchUserId, setSendingSearchUserId] = useState<number | null>(null);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [searchMohLoading, setSearchMohLoading] = useState(false);
  const [mapMohLoading, setMapMohLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const visibleError = useAutoDismiss(error, 5000);
  const visibleSuccess = useAutoDismiss(success, 5000);

  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserResponseDto | null>(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState<string | undefined>(undefined);
  const [selectedRequest, setSelectedRequest] = useState<ConnectionRequestResponseDto | null>(null);
  const [selectedRequestType, setSelectedRequestType] = useState<"received" | "sent">("received");

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

  async function loadDistricts() {
    try {
      setDistrictLoading(true);
      const districts = await assignmentApi.getDistricts(token);
      setDistrictOptions(districts);
    } catch (err) {
      console.error(err);
    } finally {
      setDistrictLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [userId, token, isMidwife, isMotherSide]);

  useEffect(() => {
    void loadDistricts();
  }, [token]);

  useEffect(() => {
    async function loadSearchMohAreas() {
      if (!searchForm.district.trim()) {
        setSearchMohAreaOptions([]);
        return;
      }

      try {
        setSearchMohLoading(true);
        const areas = await assignmentApi.getMohAreasByDistrict(
          searchForm.district.trim(),
          token
        );
        setSearchMohAreaOptions(areas);
      } catch {
        setSearchMohAreaOptions([]);
      } finally {
        setSearchMohLoading(false);
      }
    }

    void loadSearchMohAreas();
  }, [searchForm.district, token]);

  useEffect(() => {
    async function loadMapMohAreas() {
      if (!mapSearchForm.district.trim()) {
        setMapMohAreaOptions([]);
        return;
      }

      try {
        setMapMohLoading(true);
        const areas = await assignmentApi.getMohAreasByDistrict(
          mapSearchForm.district.trim(),
          token
        );
        setMapMohAreaOptions(areas);
      } catch {
        setMapMohAreaOptions([]);
      } finally {
        setMapMohLoading(false);
      }
    }

    void loadMapMohAreas();
  }, [mapSearchForm.district, token]);

  const connectedOrRequestedUserIds = useMemo(() => {
    const ids = new Set<number>();

    sentRequests.forEach((req) => ids.add(req.receiverId));
    receivedRequests.forEach((req) => ids.add(req.senderId));

    if (isMidwife) {
      assignedUsers.forEach((user) => ids.add(user.id));
    }

    if (isMotherSide && assignedMidwife?.id) {
      ids.add(assignedMidwife.id);
    }

    return ids;
  }, [sentRequests, receivedRequests, assignedUsers, assignedMidwife, isMidwife, isMotherSide]);

  const filteredSearchResults = useMemo(() => {
    return searchResults.filter((user) => !connectedOrRequestedUserIds.has(user.id));
  }, [searchResults, connectedOrRequestedUserIds]);

  const filteredMapUsers = useMemo(() => {
    return mapUsers.filter((user) => !connectedOrRequestedUserIds.has(user.id));
  }, [mapUsers, connectedOrRequestedUserIds]);

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

      if (!searchForm.district.trim()) throw new Error("District is required.");
      if (!searchForm.mohArea.trim()) throw new Error("MOH area is required.");

      const results = await assignmentApi.searchUsersByDistrictAndMohArea(
        userId,
        {
          district: searchForm.district.trim(),
          mohArea: searchForm.mohArea.trim(),
        },
        token
      );

      setSearchResults(results);
      setSearchPopupOpen(true);
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

      if (!mapSearchForm.district.trim()) throw new Error("District is required.");
      if (!mapSearchForm.mohArea.trim()) throw new Error("MOH area is required.");

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

      setSearchResults((prev) => prev.filter((u) => u.id !== receiver.id));
      setMapUsers((prev) => prev.filter((u) => u.id !== receiver.id));

      if (selectedUserForDetails?.id === receiver.id) {
        setSelectedUserForDetails(null);
      }

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
      setSelectedRequest(null);
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
      setSelectedRequest(null);
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
      setError(err instanceof Error ? err.message : "Failed to update assigned user");
    }
  }

  const topTabs: Array<{ key: MainTab; label: string; hidden?: boolean }> = [
    { key: "search-connect", label: "Search & Connect" },
    { key: "assignment", label: "My Assignment" },
    { key: "requests", label: "Received & Sent Requests" },
    {
      key: "update-profile",
      label: "Update Assigned Mother Profile",
      hidden: !isMidwife,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <AssignmentPageHeader />

        {visibleError ? (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {visibleError}
          </div>
        ) : null}

        {visibleSuccess ? (
          <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {visibleSuccess}
          </div>
        ) : null}

        <AssignmentTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={topTabs}
        />

        {activeTab === "search-connect" ? (
          <SearchConnectSection
            isMidwife={isMidwife}
            isMotherSide={isMotherSide}
            districtOptions={districtOptions}
            districtLoading={districtLoading}
            searchForm={searchForm}
            setSearchForm={setSearchForm}
            searchMohAreaOptions={searchMohAreaOptions}
            searchMohLoading={searchMohLoading}
            searching={searching}
            onSearchUsers={handleSearchUsers}
            mapSearchForm={mapSearchForm}
            setMapSearchForm={setMapSearchForm}
            mapMohAreaOptions={mapMohAreaOptions}
            mapMohLoading={mapMohLoading}
            mapSearching={mapSearching}
            onMapSearchUsers={handleMapSearchUsers}
            method={method}
            setMethod={setMethod}
            targetEmail={targetEmail}
            setTargetEmail={setTargetEmail}
            targetArea={targetArea}
            setTargetArea={setTargetArea}
            message={message}
            setMessage={setMessage}
            onSendRequest={handleSendRequest}
            filteredMapUsers={filteredMapUsers}
            filteredSearchResults={filteredSearchResults}
            searchPopupOpen={searchPopupOpen}
            setSearchPopupOpen={setSearchPopupOpen}
            sendingSearchUserId={sendingSearchUserId}
            onSendRequestToSearchedUser={(user) =>
              void handleSendRequestToSearchedUser(user)
            }
            onViewUserDetails={(user, status) => {
              setSelectedUserForDetails(user);
              setSelectedUserStatus(status);
            }}
          />
        ) : null}

        {activeTab === "assignment" ? (
          <AssignmentSection
            isMotherSide={isMotherSide}
            isMidwife={isMidwife}
            assignedMidwife={assignedMidwife}
            assignedUsers={assignedUsers}
            onViewUserDetails={(user, status) => {
              setSelectedUserForDetails(user);
              setSelectedUserStatus(status);
            }}
          />
        ) : null}

        {activeTab === "requests" ? (
          <RequestsSection
            loading={loading}
            receivedRequests={receivedRequests}
            sentRequests={sentRequests}
            onViewRequest={(request, type) => {
              setSelectedRequest(request);
              setSelectedRequestType(type);
            }}
          />
        ) : null}

        {activeTab === "update-profile" && isMidwife ? (
          <UpdateAssignedMotherSection
            assignedUsers={assignedUsers}
            selectedMotherId={selectedMotherId}
            setSelectedMotherId={setSelectedMotherId}
            updateForm={updateForm}
            setUpdateForm={setUpdateForm}
            onSubmit={handleUpdateAssignedMother}
          />
        ) : null}
      </div>

      <UserDetailsModal
        user={selectedUserForDetails}
        open={!!selectedUserForDetails}
        onClose={() => {
          setSelectedUserForDetails(null);
          setSelectedUserStatus(undefined);
        }}
        onSendRequest={
          selectedUserStatus === "AVAILABLE"
            ? (user) => void handleSendRequestToSearchedUser(user)
            : undefined
        }
        sendingUserId={sendingSearchUserId}
        statusLabel={selectedUserStatus}
      />

      <RequestDetailsModal
        request={selectedRequest}
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        type={selectedRequestType}
        onApprove={(requestId) => void handleApprove(requestId)}
        onReject={(requestId) => void handleReject(requestId)}
        actionLoadingId={actionLoadingId}
      />
    </div>
  );
}