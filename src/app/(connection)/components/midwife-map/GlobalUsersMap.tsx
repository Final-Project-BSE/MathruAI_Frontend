"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";

import type { MapUserResponseDto } from "../../../api/user-assign/types";
import type { AssignmentTranslations } from "../assignmentLang";
import { getStatusLabel } from "../assignmentLang";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Status = "AVAILABLE" | "PENDING" | "ASSIGNED";

type Props = {
  users: MapUserResponseDto[];
  getStatus: (user: MapUserResponseDto) => Status;
  sendingUserId: number | null;
  onSendRequest: (user: MapUserResponseDto) => void;
  onViewDetails: (user: MapUserResponseDto) => void;
  mode: "patient-midwives" | "midwife-patients";
  labels: AssignmentTranslations;
};

const DEFAULT_CENTER: [number, number] = [7.8731, 80.7718];

function hasCoordinates(
  user: MapUserResponseDto
): user is MapUserResponseDto & {
  latitude: number;
  longitude: number;
} {
  return (
    typeof user.latitude === "number" &&
    typeof user.longitude === "number"
  );
}

function badgeClass(status: Status) {
  if (status === "PENDING") return "bg-yellow-500/20 text-yellow-700";
  if (status === "ASSIGNED") return "bg-emerald-500/20 text-emerald-700";
  return "bg-blue-500/20 text-blue-700";
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

export default function GlobalUsersMap({
  users,
  getStatus,
  sendingUserId,
  onSendRequest,
  onViewDetails,
  mode,
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
      .map((user) => {
        const status = getStatus(user);
        return `${user.id}:${user.latitude}:${user.longitude}:${status}`;
      })
      .join("|");
  }, [validUsers, getStatus]);

  useEffect(() => {
    const mapElement = mapElementRef.current;

    if (!mapElement) return;

    /**
     * Critical:
     * Leaflet stores an internal _leaflet_id on the DOM node.
     * If React reuses the node, Leaflet thinks the map is already initialized.
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
      zoom: 8,
      zoomControl: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    validUsers.forEach((user) => {
      const status = getStatus(user);
      const canSend = status === "AVAILABLE";

      const popupContainer = document.createElement("div");
      popupContainer.className = "min-w-[260px] space-y-3 text-xs text-black";

      popupContainer.innerHTML = `
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="font-semibold">
              ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}
            </p>
            <p class="text-gray-600">${escapeHtml(user.email)}</p>
          </div>

          <span class="rounded-full px-2 py-1 text-[10px] font-semibold ${badgeClass(
            status
          )}">
            ${escapeHtml(getStatusLabel(status, labels))}
          </span>
        </div>

        <div class="space-y-1 text-[11px] text-gray-700">
          <p>
            <span class="font-medium">${escapeHtml(labels.common.address)}:</span>
            ${escapeHtml(user.address || labels.common.unavailable)}
          </p>

          <p>
            <span class="font-medium">${escapeHtml(labels.common.district)}:</span>
            ${escapeHtml(user.district || labels.common.unavailable)}
          </p>

          <p>
            <span class="font-medium">${escapeHtml(labels.common.mohArea)}:</span>
            ${escapeHtml(user.mohArea || labels.common.unavailable)}
          </p>

          ${
            mode === "patient-midwives"
              ? `
                <p>
                  <span class="font-medium">${escapeHtml(
                    labels.details.midwifeName
                  )}:</span>
                  ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}
                </p>
              `
              : `
                <p>
                  <span class="font-medium">${escapeHtml(
                    labels.details.assignedMidwife
                  )}:</span>
                  ${escapeHtml(
                    user.assignedMidwifeName || labels.common.unavailable
                  )}
                </p>
              `
          }
        </div>
      `;

      const buttonRow = document.createElement("div");
      buttonRow.className = "flex gap-2";

      const sendButton = document.createElement("button");
      sendButton.type = "button";
      sendButton.disabled = !canSend || sendingUserId === user.id;
      sendButton.className =
        "rounded-lg bg-[#d04f51] px-3 py-2 text-sm text-white disabled:opacity-50";
      sendButton.textContent =
        sendingUserId === user.id
          ? labels.common.sending
          : labels.common.sendRequest;

      sendButton.addEventListener("click", () => {
        onSendRequest(user);
      });

      const viewButton = document.createElement("button");
      viewButton.type = "button";
      viewButton.className =
        "rounded-lg border border-[#d04f51] px-3 py-2 text-sm text-[#d04f51]";
      viewButton.textContent = labels.common.view;

      viewButton.addEventListener("click", () => {
        onViewDetails(user);
      });

      buttonRow.appendChild(sendButton);
      buttonRow.appendChild(viewButton);
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
    mode,
    labels,
    sendingUserId,
    onSendRequest,
    onViewDetails,
    getStatus,
  ]);

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-xl border border-white/10">
      <div ref={mapElementRef} className="h-full w-full z-0" />
    </div>
  );
}