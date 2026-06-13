"use client";

import { useEffect, useMemo, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import L from "leaflet";
import type { UserResponseDto } from "../../api/user-assign/types";
import type { AssignmentTranslations } from "./assignmentLang";
import { getStatusLabel } from "./assignmentLang";
import "./midwife-map/leaflet-icons";

type Props = {
  users: UserResponseDto[];
  sendingUserId: number | null;
  onSendRequest: (user: UserResponseDto) => void;
  onViewDetails?: (user: UserResponseDto) => void;
  labels: AssignmentTranslations;
};

const DEFAULT_CENTER: [number, number] = [7.8731, 80.7718];

function hasCoordinates(
  user: UserResponseDto
): user is UserResponseDto & {
  latitude: number;
  longitude: number;
} {
  return typeof user.latitude === "number" && typeof user.longitude === "number";
}

function PopupContent({
  user,
  sendingUserId,
  onSendRequest,
  onViewDetails,
  labels,
}: {
  user: UserResponseDto & { latitude: number; longitude: number };
  sendingUserId: number | null;
  onSendRequest: (user: UserResponseDto) => void;
  onViewDetails?: (user: UserResponseDto) => void;
  labels: AssignmentTranslations;
}) {
  return (
    <div className="min-w-[230px] space-y-3 text-xs text-black">
      <div>
        <p className="font-semibold">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-gray-600">{user.email}</p>
        <p className="mt-1 text-xs font-medium text-emerald-600">
          {getStatusLabel("AVAILABLE", labels)}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSendRequest(user)}
          disabled={sendingUserId === user.id}
          className="rounded-lg bg-[#d04f51] px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {sendingUserId === user.id
            ? labels.common.sending
            : labels.common.sendRequest}
        </button>

        {onViewDetails ? (
          <button
            type="button"
            onClick={() => onViewDetails(user)}
            className="rounded-lg border border-[#d04f51] px-3 py-2 text-sm text-[#d04f51]"
          >
            {labels.common.view}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function AreaUserMap({
  users,
  sendingUserId,
  onSendRequest,
  onViewDetails,
  labels,
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
    .map((user) => `${user.id}:${user.latitude}:${user.longitude}`)
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

    delete (element as unknown as { _leaflet_id?: number })._leaflet_id;
    element.innerHTML = "";

    const map = L.map(element, {
      center,
      zoom: 11,
      zoomControl: true,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    validUsers.forEach((user) => {
      const popupElement = document.createElement("div");
      const root = createRoot(popupElement);

      root.render(
        <PopupContent
          user={user}
          sendingUserId={sendingUserId}
          onSendRequest={onSendRequest}
          onViewDetails={onViewDetails}
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
    labels,
    onSendRequest,
    onViewDetails,
    validUsers,
  ]);

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-lg border border-white/10">
      <div ref={mapElementRef} className="h-full w-full z-0" />
    </div>
  );
}