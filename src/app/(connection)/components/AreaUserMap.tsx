"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { UserResponseDto } from "../../api/user-assign/types";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  users: UserResponseDto[];
  sendingUserId: number | null;
  onSendRequest: (user: UserResponseDto) => void;
  onViewDetails?: (user: UserResponseDto) => void;
};

const DEFAULT_CENTER: [number, number] = [7.8731, 80.7718];

function hasCoordinates(user: UserResponseDto): user is UserResponseDto & {
  latitude: number;
  longitude: number;
} {
  return typeof user.latitude === "number" && typeof user.longitude === "number";
}

export default function AreaUserMap({
  users,
  sendingUserId,
  onSendRequest,
  onViewDetails,
}: Props) {
  const validUsers = users.filter(hasCoordinates);

  const center: [number, number] =
    validUsers.length > 0
      ? [validUsers[0].latitude, validUsers[0].longitude]
      : DEFAULT_CENTER;

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-lg border border-white/10">
      <MapContainer center={center} zoom={11} className="h-full w-full z-0">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validUsers.map((user) => (
          <Marker key={user.id} position={[user.latitude, user.longitude]}>
            <Popup>
              <div className="min-w-[230px] space-y-3 text-xs text-black">
                <div>
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-600">AVAILABLE</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSendRequest(user)}
                    disabled={sendingUserId === user.id}
                    className="rounded-lg bg-[#d04f51] px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {sendingUserId === user.id ? "Sending..." : "Send Request"}
                  </button>

                  {onViewDetails ? (
                    <button
                      type="button"
                      onClick={() => onViewDetails(user)}
                      className="rounded-lg border border-[#d04f51] px-3 py-2 text-sm text-[#d04f51]"
                    >
                      →
                    </button>
                  ) : null}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}