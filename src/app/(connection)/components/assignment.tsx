"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { cn, hasMidwifeRole, hasMotherRole } from "./utils";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { useLanguage } from "@/components/common/useLanguage";

type Props = {
  userId: number;
  token: string;
  roles: Role[];
};

export default function Assignment({ userId, token, roles }: Props) {
  const { t } = useLanguage();
  const labels = t.assignment;

  const isMidwife = useMemo(() => hasMidwifeRole(roles), [roles]);
  const isMotherSide = useMemo(() => hasMotherRole(roles), [roles]);

  const theme: "light" | "dark" = isMidwife ? "dark" : "light";
  const isLightTheme = theme === "light";

  const [activeTab, setActiveTab] = useState<MainTab>("search-connect");

  const [method, setMethod] = useState<ConnectionRequestMethod>("EMAIL");
  const [targetEmail, setTargetEmail] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [message, setMessage] = useState("");

  const [sentRequests, setSentRequests] = useState<
    ConnectionRequestResponseDto[]
  >([]);
  const [receivedRequests, setReceivedRequests] = useState<
    ConnectionRequestResponseDto[]
  >([]);
  const [assignedUsers, setAssignedUsers] = useState<UserResponseDto[]>([]);
  const [assignedMidwife, setAssignedMidwife] =
    useState<UserResponseDto | null>(null);

  const [selectedMotherId, setSelectedMotherId] = useState<number | "">("");
  const [updateForm, setUpdateForm] =
    useState<AssignedUserProfileUpdateRequestDto>({
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
  const [searchMohAreaOptions, setSearchMohAreaOptions] = useState<string[]>(
    []
  );
  const [mapMohAreaOptions, setMapMohAreaOptions] = useState<string[]>([]);

  const [searchResults, setSearchResults] = useState<UserResponseDto[]>([]);
  const [mapUsers, setMapUsers] = useState<UserResponseDto[]>([]);

  const [searching, setSearching] = useState(false);
  const [mapSearching, setMapSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [assignmentActionLoadingId, setAssignmentActionLoadingId] = useState<
    number | "midwife" | null
  >(null);
  const [sendingSearchUserId, setSendingSearchUserId] = useState<number | null>(
    null
  );
  const [districtLoading, setDistrictLoading] = useState(false);
  const [searchMohLoading, setSearchMohLoading] = useState(false);
  const [mapMohLoading, setMapMohLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const visibleError = useAutoDismiss(error, 5000);
  const visibleSuccess = useAutoDismiss(success, 5000);

  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] =
    useState<UserResponseDto | null>(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState<
    string | undefined
  >(undefined);
  const [selectedRequest, setSelectedRequest] =
    useState<ConnectionRequestResponseDto | null>(null);
  const [selectedRequestType, setSelectedRequestType] = useState<
    "received" | "sent"
  >("received");

  const loadData = useCallback(async () => {
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
        const users = await assignmentApi.getAssignedUsersForMidwife(
          userId,
          token
        );
        setAssignedUsers(users);
      } else {
        setAssignedUsers([]);
      }

      if (isMotherSide) {
        try {
          const midwife = await assignmentApi.getAssignedMidwifeForMother(
            userId,
            token
          );
          setAssignedMidwife(midwife);
        } catch {
          setAssignedMidwife(null);
        }
      } else {
        setAssignedMidwife(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : labels.messages.failedLoadData
      );
    } finally {
      setLoading(false);
    }
  }, [
    userId,
    token,
    isMidwife,
    isMotherSide,
    labels.messages.failedLoadData,
  ]);

  const loadDistricts = useCallback(async () => {
    try {
      setDistrictLoading(true);
      const districts = await assignmentApi.getDistricts(token);
      setDistrictOptions(districts);
    } catch (err) {
      console.error(err);
    } finally {
      setDistrictLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    void loadDistricts();
  }, [loadDistricts]);

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

  const pendingRequestedUserIds = useMemo(() => {
    const ids = new Set<number>();

    sentRequests
      .filter((req) => req.status === "PENDING")
      .forEach((req) => ids.add(req.receiverId));

    receivedRequests
      .filter((req) => req.status === "PENDING")
      .forEach((req) => ids.add(req.senderId));

    return ids;
  }, [sentRequests, receivedRequests]);

  const currentlyAssignedUserIds = useMemo(() => {
    const ids = new Set<number>();

    if (isMidwife) {
      assignedUsers.forEach((user) => ids.add(user.id));
    }

    if (isMotherSide && assignedMidwife?.id) {
      ids.add(assignedMidwife.id);
    }

    return ids;
  }, [assignedUsers, assignedMidwife, isMidwife, isMotherSide]);

  const hiddenUserIds = useMemo(() => {
    const ids = new Set<number>();

    pendingRequestedUserIds.forEach((id) => ids.add(id));
    currentlyAssignedUserIds.forEach((id) => ids.add(id));

    return ids;
  }, [pendingRequestedUserIds, currentlyAssignedUserIds]);

  const filteredSearchResults = useMemo(() => {
    return searchResults.filter((user) => !hiddenUserIds.has(user.id));
  }, [searchResults, hiddenUserIds]);

  const filteredMapUsers = useMemo(() => {
    return mapUsers.filter((user) => !hiddenUserIds.has(user.id));
  }, [mapUsers, hiddenUserIds]);

  async function handleSendRequest(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      if (method === "EMAIL" && !targetEmail.trim()) {
        throw new Error(labels.messages.targetEmailRequired);
      }

      if (method === "AREA" && !targetArea.trim()) {
        throw new Error(labels.messages.targetAreaRequired);
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

      setSuccess(labels.messages.createdRequests(created.length));
      setTargetEmail("");
      setTargetArea("");
      setMessage("");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : labels.messages.failedSendRequest
      );
    }
  }

  async function handleSearchUsers(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSearching(true);
      setError("");
      setSuccess("");

      if (!searchForm.district.trim()) {
        throw new Error(labels.messages.districtRequired);
      }

      if (!searchForm.mohArea.trim()) {
        throw new Error(labels.messages.mohAreaRequired);
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
      setSearchPopupOpen(true);
      setSuccess(labels.messages.foundUsers(results.length));
    } catch (err) {
      setSearchResults([]);
      setError(
        err instanceof Error ? err.message : labels.messages.failedSearchUsers
      );
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
        throw new Error(labels.messages.districtRequired);
      }

      if (!mapSearchForm.mohArea.trim()) {
        throw new Error(labels.messages.mohAreaRequired);
      }

      const results =
        await assignmentApi.searchMappableUsersByDistrictAndMohArea(
          userId,
          {
            district: mapSearchForm.district.trim(),
            mohArea: mapSearchForm.mohArea.trim(),
          },
          token
        );

      setMapUsers(results);
      setSuccess(labels.messages.foundMappableUsers(results.length));
    } catch (err) {
      setMapUsers([]);
      setError(
        err instanceof Error
          ? err.message
          : labels.messages.failedSearchMapUsers
      );
    } finally {
      setMapSearching(false);
    }
  }

  async function handleSendRequestToSearchedUser(receiver: UserResponseDto) {
    try {
      setSendingSearchUserId(receiver.id);
      setError("");
      setSuccess("");

      const name = `${receiver.firstName} ${receiver.lastName}`;

      const created = await assignmentApi.sendRequest(
        userId,
        {
          method: "EMAIL",
          targetEmail: receiver.email,
          message: labels.messages.connectionRequestTo(name),
        },
        token
      );

      setSuccess(labels.messages.createdRequests(created.length));

      setSearchResults((prev) => prev.filter((u) => u.id !== receiver.id));
      setMapUsers((prev) => prev.filter((u) => u.id !== receiver.id));

      if (selectedUserForDetails?.id === receiver.id) {
        setSelectedUserForDetails(null);
      }

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : labels.messages.failedSendRequest
      );
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
      setSuccess(labels.messages.requestApproved);
      await loadData();
      setSelectedRequest(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : labels.messages.failedApproveRequest
      );
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
      setSuccess(labels.messages.requestRejected);
      await loadData();

      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : labels.messages.failedRejectRequest
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleCancelSentRequest(requestId: number) {
    try {
      setActionLoadingId(requestId);
      setError("");
      setSuccess("");

      await assignmentApi.cancelRequest(requestId, userId, token);
      setSuccess(labels.messages.requestCancelled);
      await loadData();

      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : labels.messages.failedCancelRequest
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleCancelAssignedMidwife() {
    try {
      setAssignmentActionLoadingId("midwife");
      setError("");
      setSuccess("");

      await assignmentApi.cancelAssignedMidwifeForMother(userId, userId, token);
      setSuccess(labels.messages.assignedMidwifeCancelled);
      setAssignedMidwife(null);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : labels.messages.failedCancelAssignedMidwife
      );
    } finally {
      setAssignmentActionLoadingId(null);
    }
  }

  async function handleCancelAssignedMother(motherUserId: number) {
    try {
      setAssignmentActionLoadingId(motherUserId);
      setError("");
      setSuccess("");

      await assignmentApi.cancelAssignedMotherForMidwife(
        userId,
        motherUserId,
        token
      );
      setSuccess(labels.messages.assignedMotherCancelled);
      await loadData();

      if (selectedUserForDetails?.id === motherUserId) {
        setSelectedUserForDetails(null);
        setSelectedUserStatus(undefined);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : labels.messages.failedCancelAssignedMother
      );
    } finally {
      setAssignmentActionLoadingId(null);
    }
  }

  async function handleUpdateAssignedMother(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedMotherId) {
      setError(labels.messages.selectAssignedUserFirst);
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

      setSuccess(labels.messages.assignedUserUpdated);
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
        err instanceof Error
          ? err.message
          : labels.messages.failedUpdateAssignedUser
      );
    }
  }

  const topTabs: Array<{ key: MainTab; label: string; hidden?: boolean }> = [
    { key: "search-connect", label: labels.tabs.searchConnect },
    { key: "assignment", label: labels.tabs.assignment },
    { key: "requests", label: labels.tabs.requests },
    {
      key: "update-profile",
      label: labels.tabs.updateProfile,
      hidden: !isMidwife,
    },
  ];

  return (
    <div
      className={cn(
        "min-h-screen",
        isLightTheme ? "bg-[#fed2cc] text-black" : "bg-black text-white"
      )}
    >
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {isMotherSide ? <TopBarFeatures /> : null}

        <AssignmentPageHeader
          isMidwife={isMidwife}
          isMotherSide={isMotherSide}
          theme={theme}
          labels={labels.header}
        />

        {visibleError ? (
          <div
            className={cn(
              "mb-4 rounded-lg px-4 py-3 text-sm",
              isLightTheme
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-red-500/30 bg-red-500/10 text-red-300"
            )}
          >
            {visibleError}
          </div>
        ) : null}

        {visibleSuccess ? (
          <div
            className={cn(
              "mb-4 rounded-lg px-4 py-3 text-sm",
              isLightTheme
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            )}
          >
            {visibleSuccess}
          </div>
        ) : null}

        <AssignmentTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={topTabs}
          theme={theme}
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
            theme={theme}
            labels={labels}
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
            onCancelAssignedMidwife={() => void handleCancelAssignedMidwife()}
            onCancelAssignedMother={(motherUserId) =>
              void handleCancelAssignedMother(motherUserId)
            }
            assignmentActionLoadingId={assignmentActionLoadingId}
            theme={theme}
            labels={labels}
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
            onRejectRequest={(requestId) => void handleReject(requestId)}
            onCancelSentRequest={(requestId) =>
              void handleCancelSentRequest(requestId)
            }
            actionLoadingId={actionLoadingId}
            theme={theme}
            labels={labels}
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
            theme={theme}
            labels={labels}
          />
        ) : null}

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
          theme={theme}
          labels={labels}
        />

        <RequestDetailsModal
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          type={selectedRequestType}
          onApprove={(requestId) => void handleApprove(requestId)}
          onReject={(requestId) => void handleReject(requestId)}
          onCancel={(requestId) => void handleCancelSentRequest(requestId)}
          actionLoadingId={actionLoadingId}
          theme={theme}
          labels={labels}
        />
      </div>
    </div>
  );
}