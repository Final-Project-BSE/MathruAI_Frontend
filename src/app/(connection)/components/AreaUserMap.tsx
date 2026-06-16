"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { UserResponseDto } from "../../api/user-assign/types";
import type { AssignmentTranslations } from "./assignmentLang";
import { getStatusLabel } from "./assignmentLang";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
  return (
    typeof user.latitude === "number" &&
    typeof user.longitude === "number"
  );
}

function escapeHtml(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function AreaUserMap({
  users,
  sendingUserId,
  onSendRequest,
  onViewDetails,
  labels,
}: Props) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const validUsers = useMemo(() => users.filter(hasCoordinates), [users]);

  const center: [number, number] =
    validUsers.length > 0
      ? [validUsers[0].latitude, validUsers[0].longitude]
      : DEFAULT_CENTER;

  const mapSignature = useMemo(() => {
    return validUsers
      .map((user) => `${user.id}:${user.latitude}:${user.longitude}`)
      .join("|");
  }, [validUsers]);

  useEffect(() => {
    const mapElement = mapElementRef.current;

    if (!mapElement) return;

    /**
     * Leaflet attaches _leaflet_id to the DOM element.
     * If React reuses the same div, Leaflet throws:
     * "Map container is already initialized."
     */
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    mapElement.innerHTML = "";

    delete (
      mapElement as HTMLDivElement & {
        _leaflet_id?: number;
      }
    )._leaflet_id;

    const map = L.map(mapElement, {
      center,
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    validUsers.forEach((user) => {
      const popupContainer = document.createElement("div");
      popupContainer.className = "min-w-[230px] space-y-3 text-xs text-black";

      popupContainer.innerHTML = `
        <div>
          <p class="font-semibold">
            ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}
          </p>

          <p class="text-gray-600">
            ${escapeHtml(user.email)}
          </p>

          <p class="mt-1 text-xs font-medium text-emerald-600">
            ${escapeHtml(getStatusLabel("AVAILABLE", labels))}
          </p>
        </div>
      `;

      const buttonRow = document.createElement("div");
      buttonRow.className = "flex gap-2";

      const sendButton = document.createElement("button");
      sendButton.type = "button";
      sendButton.disabled = sendingUserId === user.id;
      sendButton.className =
        "rounded-lg bg-[#d04f51] px-3 py-2 text-sm text-white disabled:opacity-50";
      sendButton.textContent =
        sendingUserId === user.id
          ? labels.common.sending
          : labels.common.sendRequest;

      sendButton.addEventListener("click", () => {
        onSendRequest(user);
      });

      buttonRow.appendChild(sendButton);

      if (onViewDetails) {
        const viewButton = document.createElement("button");
        viewButton.type = "button";
        viewButton.className =
          "rounded-lg border border-[#d04f51] px-3 py-2 text-sm text-[#d04f51]";
        viewButton.textContent = labels.common.view;

        viewButton.addEventListener("click", () => {
          onViewDetails(user);
        });

        buttonRow.appendChild(viewButton);
      }

      popupContainer.appendChild(buttonRow);

      L.marker([user.latitude, user.longitude])
        .addTo(map)
        .bindPopup(popupContainer);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => {
      map.remove();

      if (mapInstanceRef.current === map) {
        mapInstanceRef.current = null;
      }

      mapElement.innerHTML = "";

      delete (
        mapElement as HTMLDivElement & {
          _leaflet_id?: number;
        }
      )._leaflet_id;
    };
  }, [
    center,
    validUsers,
    mapSignature,
    labels,
    sendingUserId,
    onSendRequest,
    onViewDetails,
  ]);

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-lg border border-white/10">
      <div ref={mapElementRef} className="h-full w-full z-0" />
    </div>
  );
}