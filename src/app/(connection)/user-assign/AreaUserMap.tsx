"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
}: Props) {
  const validUsers = users.filter(hasCoordinates);

  const center: [number, number] =
    validUsers.length > 0
      ? [validUsers[0].latitude, validUsers[0].longitude]
      : DEFAULT_CENTER;

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-2xl border">
      <MapContainer center={center} zoom={11} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validUsers.map((user) => (
          <Marker
            key={user.id}
            position={[user.latitude, user.longitude]}
          >
            <Popup>
              <div className="min-w-[220px] space-y-2">
                <div>
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                <div className="text-sm">
                  <p>
                    <span className="font-medium">District:</span>{" "}
                    {user.district || "-"}
                  </p>
                  <p>
                    <span className="font-medium">MOH Area:</span>{" "}
                    {user.mohArea || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Area:</span>{" "}
                    {user.area || "-"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSendRequest(user)}
                  disabled={sendingUserId === user.id}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  {sendingUserId === user.id ? "Sending..." : "Send Request"}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}