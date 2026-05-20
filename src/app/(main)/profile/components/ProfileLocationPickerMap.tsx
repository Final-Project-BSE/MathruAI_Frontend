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
import { useLanguage } from "@/components/common/useLanguage";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
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
  const { t } = useLanguage();

  const center = useMemo<[number, number]>(() => {
    if (typeof latitude === "number" && typeof longitude === "number") {
      return [latitude, longitude];
    }

    return SRI_LANKA_CENTER;
  }, [latitude, longitude]);

  const hasMarker =
    typeof latitude === "number" && typeof longitude === "number";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="border-b bg-gray-50 px-4 py-2 text-sm text-gray-600">
        {t.profile.map.instruction}
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
                {t.profile.map.selectedLocation}
                <br />
                {t.profile.map.latitude}: {latitude}
                <br />
                {t.profile.map.longitude}: {longitude}
              </Popup>
            </Marker>
          ) : null}
        </MapContainer>
      </div>
    </div>
  );
}