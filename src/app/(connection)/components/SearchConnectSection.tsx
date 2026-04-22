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
}: Props) {
  return (
    <>
      <div className="space-y-6">
        <section className="rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-xl">
          <h2 className="mb-3 text-md font-semibold">
            {isMidwife
              ? "Search Mothers by District & MOH Area"
              : isMotherSide
              ? "Search Midwives by District & MOH Area"
              : "Search Users"}
          </h2>

          <form
            onSubmit={onSearchUsers}
            className="grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <SearchableSelect
              label="District"
              value={searchForm.district}
              options={districtOptions}
              placeholder={
                districtLoading ? "Loading districts..." : "Select or type district"
              }
              onChange={(value) =>
                setSearchForm((prev) => ({
                  ...prev,
                  district: value,
                  mohArea: "",
                }))
              }
            />

            <SearchableSelect
              label="MOH Area"
              value={searchForm.mohArea}
              options={searchMohAreaOptions}
              disabled={!searchForm.district.trim()}
              placeholder={
                !searchForm.district.trim()
                  ? "Select district first"
                  : searchMohLoading
                  ? "Loading MOH areas..."
                  : "Select or type MOH area"
              }
              onChange={(value) =>
                setSearchForm((prev) => ({
                  ...prev,
                  mohArea: value,
                }))
              }
            />

            <button
              type="submit"
              disabled={searching}
              className="rounded-md bg-[#d04f51] px-4 py-1 text-sm text-white transition hover:bg-[#e86466] disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-400">
            Search results will open in a popup box.
          </p>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-xl">
          <h2 className="mb-3 text-md font-semibold">
            {isMidwife
              ? "Map of Mothers in Selected Area"
              : isMotherSide
              ? "Map of Midwives in Selected Area"
              : "Map Search"}
          </h2>

          <form
            onSubmit={onMapSearchUsers}
            className="grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <SearchableSelect
              label="District"
              value={mapSearchForm.district}
              options={districtOptions}
              placeholder={
                districtLoading ? "Loading districts..." : "Select or type district"
              }
              onChange={(value) =>
                setMapSearchForm((prev) => ({
                  ...prev,
                  district: value,
                  mohArea: "",
                }))
              }
            />

            <SearchableSelect
              label="MOH Area"
              value={mapSearchForm.mohArea}
              options={mapMohAreaOptions}
              disabled={!mapSearchForm.district.trim()}
              placeholder={
                !mapSearchForm.district.trim()
                  ? "Select district first"
                  : mapMohLoading
                  ? "Loading MOH areas..."
                  : "Select or type MOH area"
              }
              onChange={(value) =>
                setMapSearchForm((prev) => ({
                  ...prev,
                  mohArea: value,
                }))
              }
            />

            <button
              type="submit"
              disabled={mapSearching}
              className="rounded-md bg-[#d04f51] px-4 py-1 text-sm text-white transition hover:bg-[#e86466] disabled:opacity-50"
            >
              {mapSearching ? "Loading Map..." : "Load Map"}
            </button>
          </form>

          <div className="mt-5">
            {filteredMapUsers.length === 0 ? (
              <p className="text-xs text-gray-400">No available mappable users found.</p>
            ) : (
              <AreaUserMap
                users={filteredMapUsers}
                sendingUserId={sendingSearchUserId}
                onSendRequest={onSendRequestToSearchedUser}
                onViewDetails={(user) => onViewUserDetails(user, "AVAILABLE")}
              />
            )}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-xl">
          <h2 className="mb-3 text-md font-semibold">Manual Connection Request</h2>

          <form onSubmit={onSendRequest} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as ConnectionRequestMethod)}
                className="w-full rounded-md border border-white/10 bg-black px-4 py-1 text-xs text-white outline-none focus:border-[#d04f51]"
              >
                <option value="EMAIL" className="text-xs">EMAIL</option>
                <option value="AREA" className="text-xs">AREA</option>
              </select>
            </div>

            {method === "EMAIL" ? (
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-300">
                  Target Email
                </label>
                <input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-md border border-white/10 bg-black px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
                />
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-300">
                  Target Area
                </label>
                <input
                  type="text"
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  placeholder="Colombo"
                  className="w-full rounded-md border border-white/10 bg-black px-4 py-1 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Optional message"
                rows={4}
                className="w-full rounded-md border border-white/10 bg-black px-4 py-1 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#d04f51]"
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-[#d04f51] px-5 py-1 text-sm text-white transition hover:bg-[#e86466]"
            >
              Send Request
            </button>
          </form>
        </section>
      </div>

      <Modal
        open={searchPopupOpen}
        title="Search Results"
        onClose={() => setSearchPopupOpen(false)}
      >
        {filteredSearchResults.length === 0 ? (
          <p className="text-xs text-gray-400">No available users to display.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSearchResults.map((user) => (
              <div
                key={user.id}
                className="rounded-md border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-xs text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>

                  <StatusBadge status="AVAILABLE" />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSendRequestToSearchedUser(user)}
                    disabled={sendingSearchUserId === user.id}
                    className="rounded-md bg-[#d04f51] px-4 py-1 text-sm text-white hover:bg-[#e86466] disabled:opacity-50"
                  >
                    {sendingSearchUserId === user.id ? "Sending..." : "Send Request"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewUserDetails(user, "AVAILABLE")}
                    className="rounded-2xl border border-white/10 px-4 py-1 text-sm text-gray-300 hover:bg-white/10"
                  >
                    →
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