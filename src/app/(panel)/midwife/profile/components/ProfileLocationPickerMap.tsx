"use client";

import { useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  latitude?: number;
  longitude?: number;
  onPick: (coords: { latitude: number; longitude: number }) => void;
};

const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];

function ClickHandler({
  onPick,
}: {
  onPick: (coords: { latitude: number; longitude: number }) => void;
}) {
  useMapEvents({
    click(e) {
      onPick({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  return null;
}

export default function ProfileLocationPickerMap({
  latitude,
  longitude,
  onPick,
}: Props) {
  const center = useMemo<[number, number]>(() => {
    if (typeof latitude === "number" && typeof longitude === "number") {
      return [latitude, longitude];
    }
    return SRI_LANKA_CENTER;
  }, [latitude, longitude]);

  const hasMarker =
    typeof latitude === "number" && typeof longitude === "number";

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
      <div className="border-b border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
        Click on the map to choose your location
      </div>

      <div className="h-[320px] w-full">
        <MapContainer center={center} zoom={10} className="h-full w-full">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler onPick={onPick} />

          {hasMarker ? (
            <Marker position={[latitude!, longitude!]}>
              <Popup>
                Selected Location
                <br />
                Lat: {latitude}
                <br />
                Lng: {longitude}
              </Popup>
            </Marker>
          ) : null}
        </MapContainer>
      </div>
    </div>
  );
}