"use client";

import dynamic from "next/dynamic";
import type {
  AreaMapSearchRequestDto,
  AreaSearchRequestDto,
  ConnectionRequestMethod,
  UserResponseDto,
} from "../../api/user-assign/types";
import SearchableSelect from "./SearchableSelect";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import type { AssignmentTranslations } from "./assignmentLang";
import { getStatusLabel } from "./assignmentLang";
import { cn } from "./utils";

const AreaUserMap = dynamic(() => import("./AreaUserMap"), { ssr: false });

type Props = {
  isMidwife: boolean;
  isMotherSide: boolean;
  districtOptions: string[];
  districtLoading: boolean;

  searchForm: AreaSearchRequestDto;
  setSearchForm: React.Dispatch<React.SetStateAction<AreaSearchRequestDto>>;
  searchMohAreaOptions: string[];
  searchMohLoading: boolean;
  searching: boolean;
  onSearchUsers: (e: React.FormEvent) => void;

  mapSearchForm: AreaMapSearchRequestDto;
  setMapSearchForm: React.Dispatch<React.SetStateAction<AreaMapSearchRequestDto>>;
  mapMohAreaOptions: string[];
  mapMohLoading: boolean;
  mapSearching: boolean;
  onMapSearchUsers: (e: React.FormEvent) => void;

  method: ConnectionRequestMethod;
  setMethod: (value: ConnectionRequestMethod) => void;
  targetEmail: string;
  setTargetEmail: (value: string) => void;
  targetArea: string;
  setTargetArea: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  onSendRequest: (e: React.FormEvent) => void;

  filteredMapUsers: UserResponseDto[];
  filteredSearchResults: UserResponseDto[];
  searchPopupOpen: boolean;
  setSearchPopupOpen: (open: boolean) => void;

  sendingSearchUserId: number | null;
  onSendRequestToSearchedUser: (user: UserResponseDto) => void;
  onViewUserDetails: (user: UserResponseDto, status: string) => void;
  theme: "light" | "dark";
  labels: AssignmentTranslations;
};

export default function SearchConnectSection({
  isMidwife,
  isMotherSide,
  districtOptions,
  districtLoading,
  searchForm,
  setSearchForm,
  searchMohAreaOptions,
  searchMohLoading,
  searching,
  onSearchUsers,
  mapSearchForm,
  setMapSearchForm,
  mapMohAreaOptions,
  mapMohLoading,
  mapSearching,
  onMapSearchUsers,
  method,
  setMethod,
  targetEmail,
  setTargetEmail,
  targetArea,
  setTargetArea,
  message,
  setMessage,
  onSendRequest,
  filteredMapUsers,
  filteredSearchResults,
  searchPopupOpen,
  setSearchPopupOpen,
  sendingSearchUserId,
  onSendRequestToSearchedUser,
  onViewUserDetails,
  theme,
  labels,
}: Props) {
  const isLightTheme = theme === "light";

  const sectionClass = cn(
    "rounded-lg border p-5 shadow-xl",
    isLightTheme ? "border-gray-200 bg-white" : "border-white/10 bg-zinc-950"
  );

  const headingClass = cn("mb-3 text-md font-semibold", isLightTheme ? "text-gray-900" : "text-white");
  const labelClass = cn("mb-2 block text-xs font-medium", isLightTheme ? "text-gray-700" : "text-gray-300");
  const mutedClass = cn("text-xs", isLightTheme ? "text-gray-600" : "text-gray-400");
  const inputClass = cn(
    "w-full rounded-md border px-4 py-2 text-xs outline-none",
    isLightTheme
      ? "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#d04f51]"
      : "border-white/10 bg-black text-white placeholder:text-gray-500 focus:border-[#d04f51]"
  );
  const secondaryButtonClass = cn(
    "rounded-2xl border px-4 py-1 text-sm",
    isLightTheme
      ? "border-gray-200 text-gray-700 hover:bg-gray-100"
      : "border-white/10 text-gray-300 hover:bg-white/10"
  );
  const cardClass = cn(
    "rounded-md border p-4",
    isLightTheme ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"
  );

  const districtPlaceholder = districtLoading
    ? labels.common.loadingDistricts
    : labels.common.selectOrTypeDistrict;

  const mohPlaceholder = (hasDistrict: boolean, loadingMoh: boolean) =>
    !hasDistrict
      ? labels.common.selectDistrictFirst
      : loadingMoh
      ? labels.common.loadingMohAreas
      : labels.common.selectOrTypeMohArea;

  return (
    <>
      <div className="space-y-6">
        <section className={sectionClass}>
          <h2 className={headingClass}>
            {isMidwife
              ? labels.searchConnect.searchMothersTitle
              : isMotherSide
              ? labels.searchConnect.searchMidwivesTitle
              : labels.searchConnect.searchUsersTitle}
          </h2>

          <form
            onSubmit={onSearchUsers}
            className="grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <SearchableSelect
              label={labels.common.district}
              value={searchForm.district}
              options={districtOptions}
              placeholder={districtPlaceholder}
              noResultsLabel={labels.common.noMatchingResults}
              onChange={(value) =>
                setSearchForm((prev) => ({
                  ...prev,
                  district: value,
                  mohArea: "",
                }))
              }
              theme={theme}
            />

            <SearchableSelect
              label={labels.common.mohArea}
              value={searchForm.mohArea}
              options={searchMohAreaOptions}
              disabled={!searchForm.district.trim()}
              placeholder={mohPlaceholder(Boolean(searchForm.district.trim()), searchMohLoading)}
              noResultsLabel={labels.common.noMatchingResults}
              onChange={(value) =>
                setSearchForm((prev) => ({
                  ...prev,
                  mohArea: value,
                }))
              }
              theme={theme}
            />

            <button
              type="submit"
              disabled={searching}
              className="rounded-md bg-[#d04f51] px-4 py-1 text-sm text-white transition hover:bg-[#e86466] disabled:opacity-50"
            >
              {searching ? labels.common.searching : labels.common.search}
            </button>
          </form>

          <p className={cn("mt-4", mutedClass)}>
            {labels.searchConnect.searchResultsOpenPopup}
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>
            {isMidwife
              ? labels.searchConnect.mothersMapTitle
              : isMotherSide
              ? labels.searchConnect.midwivesMapTitle
              : labels.searchConnect.mapSearchTitle}
          </h2>

          <form
            onSubmit={onMapSearchUsers}
            className="grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <SearchableSelect
              label={labels.common.district}
              value={mapSearchForm.district}
              options={districtOptions}
              placeholder={districtPlaceholder}
              noResultsLabel={labels.common.noMatchingResults}
              onChange={(value) =>
                setMapSearchForm((prev) => ({
                  ...prev,
                  district: value,
                  mohArea: "",
                }))
              }
              theme={theme}
            />

            <SearchableSelect
              label={labels.common.mohArea}
              value={mapSearchForm.mohArea}
              options={mapMohAreaOptions}
              disabled={!mapSearchForm.district.trim()}
              placeholder={mohPlaceholder(Boolean(mapSearchForm.district.trim()), mapMohLoading)}
              noResultsLabel={labels.common.noMatchingResults}
              onChange={(value) =>
                setMapSearchForm((prev) => ({
                  ...prev,
                  mohArea: value,
                }))
              }
              theme={theme}
            />

            <button
              type="submit"
              disabled={mapSearching}
              className="rounded-md bg-[#d04f51] px-4 py-1 text-sm text-white transition hover:bg-[#e86466] disabled:opacity-50"
            >
              {mapSearching ? labels.searchConnect.loadingMap : labels.searchConnect.loadMap}
            </button>
          </form>

          <div className="mt-5">
            {filteredMapUsers.length === 0 ? (
              <p className={mutedClass}>{labels.searchConnect.noMappableUsers}</p>
            ) : (
              <AreaUserMap
                users={filteredMapUsers}
                sendingUserId={sendingSearchUserId}
                onSendRequest={onSendRequestToSearchedUser}
                onViewDetails={(user) => onViewUserDetails(user, "AVAILABLE")}
                labels={labels}
              />
            )}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>{labels.searchConnect.manualConnectionRequest}</h2>

          <form onSubmit={onSendRequest} className="space-y-4">
            <div>
              <label className={labelClass}>{labels.common.method}</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as ConnectionRequestMethod)}
                className={inputClass}
              >
                <option value="EMAIL" className="text-xs">EMAIL</option>
                <option value="AREA" className="text-xs">AREA</option>
              </select>
            </div>

            {method === "EMAIL" ? (
              <div>
                <label className={labelClass}>{labels.common.targetEmail}</label>
                <input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder={labels.common.exampleEmail}
                  className={inputClass}
                />
              </div>
            ) : (
              <div>
                <label className={labelClass}>{labels.common.targetArea}</label>
                <input
                  type="text"
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  placeholder={labels.common.area}
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className={labelClass}>{labels.common.message}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={labels.common.optionalMessage}
                rows={4}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-[#d04f51] px-5 py-1 text-sm text-white transition hover:bg-[#e86466]"
            >
              {labels.common.sendRequest}
            </button>
          </form>
        </section>
      </div>

      <Modal
        open={searchPopupOpen}
        title={labels.searchConnect.searchResults}
        onClose={() => setSearchPopupOpen(false)}
        theme={theme}
        closeLabel={labels.common.close}
      >
        {filteredSearchResults.length === 0 ? (
          <p className={mutedClass}>{labels.searchConnect.noAvailableUsers}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSearchResults.map((user) => (
              <div key={user.id} className={cardClass}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p
                      className={cn(
                        "text-xs font-semibold",
                        isLightTheme ? "text-gray-900" : "text-white"
                      )}
                    >
                      {user.firstName} {user.lastName}
                    </p>
                    <p className={mutedClass}>{user.email}</p>
                    <p className={mutedClass}>
                      {labels.common.district}: {user.district || labels.common.unavailable}
                    </p>
                    <p className={mutedClass}>
                      {labels.common.mohArea}: {user.mohArea || labels.common.unavailable}
                    </p>
                  </div>

                  <StatusBadge status="AVAILABLE" label={getStatusLabel("AVAILABLE", labels)} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onSendRequestToSearchedUser(user)}
                    disabled={sendingSearchUserId === user.id}
                    className="rounded-md bg-[#d04f51] px-3 py-2 text-xs text-white transition hover:bg-[#e86466] disabled:opacity-50"
                  >
                    {sendingSearchUserId === user.id
                      ? labels.common.sending
                      : labels.common.sendRequest}
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewUserDetails(user, "AVAILABLE")}
                    className={secondaryButtonClass}
                  >
                    {labels.common.view}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
