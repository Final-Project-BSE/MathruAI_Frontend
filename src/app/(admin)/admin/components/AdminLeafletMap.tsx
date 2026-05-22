"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { UserResponseDto } from "@/app/api/admin/types";

type Props = {
  users: UserResponseDto[];
  center: [number, number];
  getCoordinates: (user: UserResponseDto) => {
    latitude: number;
    longitude: number;
  } | null;
  badgeClass: (user: UserResponseDto) => string;
  userType: (user: UserResponseDto) => string;
};

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function AdminLeafletMap({
  users,
  center,
  getCoordinates,
  badgeClass,
  userType,
}: Props) {
  return (
    <div className="h-[620px] w-full">
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {users.map((user) => {
          const coordinates = getCoordinates(user);
          if (!coordinates) return null;

          return (
            <Marker
              key={user.id}
              position={[coordinates.latitude, coordinates.longitude]}
            >
              <Popup>
                <div className="min-w-[240px] space-y-2 text-xs text-black">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-gray-600">{user.email || "No email"}</p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold ${badgeClass(
                        user
                      )}`}
                    >
                      {userType(user)}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-gray-700">
                    <p>
                      <span className="font-medium">District:</span>{" "}
                      {user.district || "No district"}
                    </p>

                    <p>
                      <span className="font-medium">MOH Area:</span>{" "}
                      {user.mohArea || "No MOH area"}
                    </p>

                    <p>
                      <span className="font-medium">Latitude:</span>{" "}
                      {coordinates.latitude}
                    </p>

                    <p>
                      <span className="font-medium">Longitude:</span>{" "}
                      {coordinates.longitude}
                    </p>
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