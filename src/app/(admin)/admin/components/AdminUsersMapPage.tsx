"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Loader2, MapPinned, Search } from "lucide-react";
import adminApi from "@/app/api/admin/api";
import type { UserResponseDto } from "@/app/api/admin/types";

type Props = {
  token: string;
};

declare global {
  interface Window {
    google?: typeof google;
    __mathruGoogleMapsLoading?: Promise<void>;
  }
}

type MapFilter = "ALL" | "MIDWIFE" | "PATIENT";

function isPatient(user: UserResponseDto) {
  return user.roles?.some((role) =>
    ["HOPE_TO_PREGNANT_MOTHER", "PREGNANT_MOTHER", "POST_PREGNANT_MOTHER"].includes(role)
  );
}

function markerColor(user: UserResponseDto) {
  if (user.roles?.includes("MIDWIFE")) return "#d04f51";
  if (isPatient(user)) return "#111827";
  return "#71717a";
}

function userType(user: UserResponseDto) {
  if (user.roles?.includes("MIDWIFE")) return "Midwife";
  if (isPatient(user)) return "Patient";
  if (user.roles?.includes("ADMIN")) return "Admin";
  return "User";
}

function loadGoogleMapsScript() {
  if (typeof window === "undefined") return Promise.resolve();

  if (window.google?.maps) return Promise.resolve();

  if (window.__mathruGoogleMapsLoading) return window.__mathruGoogleMapsLoading;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.reject(
      new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file.")
    );
  }

  window.__mathruGoogleMapsLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps."));
    document.head.appendChild(script);
  });

  return window.__mathruGoogleMapsLoading;
}

export default function AdminUsersMapPage({ token }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MapFilter>("ALL");

  const mappedUsers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return users.filter((user) => {
      const hasLocation =
        typeof user.latitude === "number" &&
        typeof user.longitude === "number" &&
        Number.isFinite(user.latitude) &&
        Number.isFinite(user.longitude);

      if (!hasLocation) return false;

      const typeMatch =
        filter === "ALL" ||
        (filter === "MIDWIFE" && user.roles?.includes("MIDWIFE")) ||
        (filter === "PATIENT" && isPatient(user));

      const searchMatch =
        !q ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.district?.toLowerCase().includes(q) ||
        user.mohArea?.toLowerCase().includes(q);

      return typeMatch && searchMatch;
    });
  }, [users, query, filter]);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await adminApi.getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setMapError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, [token]);

  useEffect(() => {
    if (!mapRef.current || loading || mapError) return;

    let cancelled = false;

    async function setupMap() {
      try {
        await loadGoogleMapsScript();

        if (cancelled || !mapRef.current || !window.google?.maps) return;

        const defaultCenter = { lat: 7.8731, lng: 80.7718 };

        if (!mapInstance.current) {
          mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 8,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
        }

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();
        const infoWindow = new window.google.maps.InfoWindow();

        mappedUsers.forEach((user) => {
          const position = {
            lat: Number(user.latitude),
            lng: Number(user.longitude),
          };

          bounds.extend(position);

          const marker = new window.google.maps.Marker({
            position,
            map: mapInstance.current,
            title: `${user.firstName} ${user.lastName}`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: markerColor(user),
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });

          marker.addListener("click", () => {
            infoWindow.setContent(`
              <div style="font-family: system-ui; min-width: 220px;">
                <strong style="font-size: 14px;">${user.firstName} ${user.lastName}</strong>
                <div style="font-size: 12px; color: #d04f51; font-weight: 700; margin-top: 3px;">${userType(user)}</div>
                <div style="font-size: 12px; color: #444; margin-top: 6px;">${user.email || ""}</div>
                <div style="font-size: 12px; color: #555; margin-top: 6px;">
                  ${user.district || "No district"} ${user.mohArea ? ` / ${user.mohArea}` : ""}
                </div>
              </div>
            `);
            infoWindow.open(mapInstance.current, marker);
          });

          markersRef.current.push(marker);
        });

        if (mappedUsers.length > 1) {
          mapInstance.current.fitBounds(bounds, 60);
        } else if (mappedUsers.length === 1) {
          mapInstance.current.setCenter({
            lat: Number(mappedUsers[0].latitude),
            lng: Number(mappedUsers[0].longitude),
          });
          mapInstance.current.setZoom(13);
        } else {
          mapInstance.current.setCenter(defaultCenter);
          mapInstance.current.setZoom(8);
        }
      } catch (err) {
        setMapError(err instanceof Error ? err.message : "Failed to render map.");
      }
    }

    void setupMap();

    return () => {
      cancelled = true;
    };
  }, [mappedUsers, loading, mapError]);

  const midwifeCount = mappedUsers.filter((user) => user.roles?.includes("MIDWIFE")).length;
  const patientCount = mappedUsers.filter(isPatient).length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#d04f51]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-[#fff2f2] px-3 py-1 text-xs font-bold text-[#d04f51]">
              Admin / Registered Users Map
            </p>
            <h1 className="text-2xl font-black text-zinc-950 md:text-4xl">
              Midwives and patients on Google Maps.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Only users with valid latitude and longitude appear on the map.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-[#fff2f2] px-4 py-3">
              <p className="text-xl font-black text-[#d04f51]">{mappedUsers.length}</p>
              <p className="text-[10px] font-bold text-zinc-500">Visible</p>
            </div>
            <div className="rounded-2xl bg-[#fff2f2] px-4 py-3">
              <p className="text-xl font-black text-[#d04f51]">{midwifeCount}</p>
              <p className="text-[10px] font-bold text-zinc-500">Midwives</p>
            </div>
            <div className="rounded-2xl bg-[#fff2f2] px-4 py-3">
              <p className="text-xl font-black text-[#d04f51]">{patientCount}</p>
              <p className="text-[10px] font-bold text-zinc-500">Patients</p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[#d04f51]/10 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <MapPinned className="text-[#d04f51]" size={18} />
            <h2 className="text-sm font-black">Live System Map</h2>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex min-w-[260px] items-center rounded-2xl border border-zinc-200 px-3 py-2">
              <Search size={15} className="text-[#d04f51]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search map users..."
                className="ml-2 w-full bg-transparent text-sm outline-none"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as MapFilter)}
              className="rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#d04f51]"
            >
              <option value="ALL">All mapped users</option>
              <option value="MIDWIFE">Midwives only</option>
              <option value="PATIENT">Patients only</option>
            </select>
          </div>
        </div>

        {mapError ? (
          <div className="m-4 flex min-h-[540px] items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            <AlertTriangle className="mr-2 h-5 w-5" />
            {mapError}
          </div>
        ) : loading ? (
          <div className="flex min-h-[540px] items-center justify-center text-[#d04f51]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading map...
          </div>
        ) : (
          <div className="grid min-h-[620px] lg:grid-cols-[1fr_340px]">
            <div ref={mapRef} className="min-h-[620px] bg-[#fff2f2]" />

            <aside className="max-h-[620px] overflow-y-auto border-t border-zinc-100 p-4 lg:border-l lg:border-t-0">
              <h3 className="mb-3 text-sm font-black">Mapped users</h3>
              <div className="space-y-2">
                {mappedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-zinc-950">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>

                      <span
                        className="rounded-full px-2 py-1 text-[10px] font-bold text-white"
                        style={{ backgroundColor: markerColor(user) }}
                      >
                        {userType(user)}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-zinc-500">
                      {user.district || "No district"} {user.mohArea ? ` / ${user.mohArea}` : ""}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-400">
                      {user.latitude}, {user.longitude}
                    </p>
                  </div>
                ))}

                {!mappedUsers.length ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500">
                    No mapped users found.
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
