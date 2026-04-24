"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { MapUserResponseDto } from "../../../api/user-assign/types";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
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
};

const DEFAULT_CENTER: [number, number] = [7.8731, 80.7718];

function hasCoordinates(user: MapUserResponseDto): user is MapUserResponseDto & {
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

export default function GlobalUsersMap({
  users,
  getStatus,
  sendingUserId,
  onSendRequest,
  onViewDetails,
  mode,
}: Props) {
  const validUsers = users.filter(hasCoordinates);

  const center: [number, number] =
    validUsers.length > 0
      ? [validUsers[0].latitude, validUsers[0].longitude]
      : DEFAULT_CENTER;

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-xl border border-white/10">
      <MapContainer center={center} zoom={8} className="h-full w-full z-0">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validUsers.map((user) => {
          const status = getStatus(user);
          const canSend = status === "AVAILABLE";

          return (
            <Marker key={user.id} position={[user.latitude, user.longitude]}>
              <Popup>
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
                      {status}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-gray-700">
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {user.address || "-"}
                    </p>
                    <p>
                      <span className="font-medium">District:</span>{" "}
                      {user.district || "-"}
                    </p>
                    <p>
                      <span className="font-medium">MOH Area:</span>{" "}
                      {user.mohArea || "-"}
                    </p>

                    {mode === "patient-midwives" ? (
                      <p>
                        <span className="font-medium">Midwife Name:</span>{" "}
                        {`${user.firstName} ${user.lastName}`}
                      </p>
                    ) : (
                      <p>
                        <span className="font-medium">Assigned Midwife:</span>{" "}
                        {user.assignedMidwifeName || "-"}
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
                      {sendingUserId === user.id ? "Sending..." : "Send Request"}
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewDetails(user)}
                      className="rounded-lg border border-[#d04f51] px-3 py-2 text-sm text-[#d04f51]"
                    >
                      View
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}