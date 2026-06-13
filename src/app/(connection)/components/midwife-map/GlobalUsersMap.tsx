"use client";

import { useEffect, useMemo, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import L from "leaflet";
import type { MapUserResponseDto } from "../../../api/user-assign/types";
import type { AssignmentTranslations } from "../assignmentLang";
import { getStatusLabel } from "../assignmentLang";
import "./leaflet-icons";

type Status = "AVAILABLE" | "PENDING" | "ASSIGNED";

type Props = {
  users: MapUserResponseDto[];
  getStatus: (user: MapUserResponseDto) => Status;
  sendingUserId: number | null;
  onSendRequest: (user: MapUserResponseDto) => void;
  onViewDetails: (user: MapUserResponseDto) => void;
  mode: "patient-midwives" | "midwife-patients";
  labels: AssignmentTranslations;
  mapInstanceKey?: string;
};

const DEFAULT_CENTER: [number, number] = [7.8731, 80.7718];

function hasCoordinates(
  user: MapUserResponseDto
): user is MapUserResponseDto & {
  latitude: number;
  longitude: number;
} {
  return typeof user.latitude === "number" && typeof user.longitude === "number";
}

function badgeClass(status: Status) {
  if (status === "PENDING") return "bg-yellow-500/20 text-yellow-700";
  if (status === "ASSIGNED") return "bg-emerald-500/20 text-emerald-700";
  return "bg-blue-500/20 text-blue-700";
}

function PopupContent({
  user,
  status,
  canSend,
  sendingUserId,
  onSendRequest,
  onViewDetails,
  mode,
  labels,
}: {
  user: MapUserResponseDto & { latitude: number; longitude: number };
  status: Status;
  canSend: boolean;
  sendingUserId: number | null;
  onSendRequest: (user: MapUserResponseDto) => void;
  onViewDetails: (user: MapUserResponseDto) => void;
  mode: "patient-midwives" | "midwife-patients";
  labels: AssignmentTranslations;
}) {
  return (
    <div className="min-w-[260px] space-y-3 text-xs text-black">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${badgeClass(
            status
          )}`}
        >
          {getStatusLabel(status, labels)}
        </span>
      </div>

      <div className="space-y-1 text-[11px] text-gray-700">
        <p>
          <span className="font-medium">{labels.common.address}:</span>{" "}
          {user.address || labels.common.unavailable}
        </p>

        <p>
          <span className="font-medium">{labels.common.district}:</span>{" "}
          {user.district || labels.common.unavailable}
        </p>

        <p>
          <span className="font-medium">{labels.common.mohArea}:</span>{" "}
          {user.mohArea || labels.common.unavailable}
        </p>

        {mode === "patient-midwives" ? (
          <p>
            <span className="font-medium">{labels.details.midwifeName}:</span>{" "}
            {user.firstName} {user.lastName}
          </p>
        ) : (
          <p>
            <span className="font-medium">
              {labels.details.assignedMidwife}:
            </span>{" "}
            {user.assignedMidwifeName || labels.common.unavailable}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSendRequest(user)}
          disabled={!canSend || sendingUserId === user.id}
          className="rounded-lg bg-[#d04f51] px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {sendingUserId === user.id
            ? labels.common.sending
            : labels.common.sendRequest}
        </button>

        <button
          type="button"
          onClick={() => onViewDetails(user)}
          className="rounded-lg border border-[#d04f51] px-3 py-2 text-sm text-[#d04f51]"
        >
          {labels.common.view}
        </button>
      </div>
    </div>
  );
}

export default function GlobalUsersMap({
  users,
  getStatus,
  sendingUserId,
  onSendRequest,
  onViewDetails,
  mode,
  labels,
  mapInstanceKey,
}: Props) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const popupRootsRef = useRef<Root[]>([]);

  const validUsers = useMemo(() => users.filter(hasCoordinates), [users]);

  const center: [number, number] =
    validUsers.length > 0
      ? [validUsers[0].latitude, validUsers[0].longitude]
      : DEFAULT_CENTER;

  const usersKey = validUsers
    .map((user) => `${user.id}:${user.latitude}:${user.longitude}:${getStatus(user)}`)
    .join("|");

  useEffect(() => {
    const element = mapElementRef.current;

    if (!element) return;

    popupRootsRef.current.forEach((root) => root.unmount());
    popupRootsRef.current = [];

    if (mapRef.current) {
      mapRef.current.off();
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Leaflet stores this on the DOM node. In Next dev/HMR/StrictMode,
    // this can survive long enough to crash the next initialization.
    delete (element as unknown as { _leaflet_id?: number })._leaflet_id;

    element.innerHTML = "";

    const map = L.map(element, {
      center,
      zoom: 8,
      zoomControl: true,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    validUsers.forEach((user) => {
      const status = getStatus(user);
      const canSend = status === "AVAILABLE";

      const popupElement = document.createElement("div");
      const root = createRoot(popupElement);

      root.render(
        <PopupContent
          user={user}
          status={status}
          canSend={canSend}
          sendingUserId={sendingUserId}
          onSendRequest={onSendRequest}
          onViewDetails={onViewDetails}
          mode={mode}
          labels={labels}
        />
      );

      popupRootsRef.current.push(root);

      L.marker([user.latitude, user.longitude])
        .addTo(map)
        .bindPopup(popupElement);
    });

    window.setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      popupRootsRef.current.forEach((root) => root.unmount());
      popupRootsRef.current = [];

      map.off();
      map.remove();

      if (mapRef.current === map) {
        mapRef.current = null;
      }

      delete (element as unknown as { _leaflet_id?: number })._leaflet_id;
      element.innerHTML = "";
    };
  }, [
    center[0],
    center[1],
    usersKey,
    sendingUserId,
    mode,
    labels,
    getStatus,
    onSendRequest,
    onViewDetails,
    validUsers,
  ]);

  return (
    <div
      key={mapInstanceKey ?? `global-users-map-${mode}`}
      className="h-[600px] w-full overflow-hidden rounded-xl border border-white/10"
    >
      <div ref={mapElementRef} className="h-full w-full z-0" />
    </div>
  );
}