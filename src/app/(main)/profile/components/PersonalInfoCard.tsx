"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import profileApi from "@/app/api/profile/api";
import type { ProfileResponse } from "@/app/api/profile/types";

const ProfileLocationPickerMap = dynamic(
  () => import("./ProfileLocationPickerMap"),
  { ssr: false }
);

interface Props {
  profile: ProfileResponse | null;
  token: string;
  userId: number;
  onUpdate: () => void;
}

const PersonalInfoCard = ({ profile, token, userId, onUpdate }: Props) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    nationalIdNumber: "",
    address: "",
    area: "",
    district: "",
    mohArea: "",
    latitude: "" as string | number,
    longitude: "" as string | number,
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!profile) return;

    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phoneNumber: profile.phoneNumber || "",
      dateOfBirth: profile.dateOfBirth || "",
      nationalIdNumber: profile.nationalIdNumber || "",
      address: profile.address || "",
      area: profile.area || "",
      district: profile.district || "",
      mohArea: profile.mohArea || "",
      latitude:
        typeof profile.latitude === "number" ? profile.latitude : "",
      longitude:
        typeof profile.longitude === "number" ? profile.longitude : "",
    });
  }, [profile]);

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    setMessage(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser.");
      }

      const coords = await new Promise<{ latitude: number; longitude: number }>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              reject(new Error(error.message || "Failed to get current location."));
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        }
      );

      setForm((prev) => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));

      setMessage({
        type: "success",
        text: "Current location loaded successfully.",
      });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to get location.",
      });
    } finally {
      setLocating(false);
    }
  };

  const handleMapPick = (coords: { latitude: number; longitude: number }) => {
    setForm((prev) => ({
      ...prev,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));

    setMessage({
      type: "success",
      text: "Location selected from map.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await profileApi.updateProfile(token, userId, {
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        phoneNumber: form.phoneNumber || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        nationalIdNumber: form.nationalIdNumber || undefined,
        address: form.address || undefined,
        area: form.area || undefined,
        district: form.district || undefined,
        mohArea: form.mohArea || undefined,
        latitude:
          form.latitude === "" ? undefined : Number(form.latitude),
        longitude:
          form.longitude === "" ? undefined : Number(form.longitude),
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });
      onUpdate();
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">
        Personal Info
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              First Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Last Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Phone Number
          </label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            National ID Number
          </label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            value={form.nationalIdNumber}
            onChange={(e) =>
              setForm({ ...form, nationalIdNumber: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Address
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 min-h-[90px]"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Area
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              District
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              MOH Area
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              value={form.mohArea}
              onChange={(e) => setForm({ ...form, mohArea: e.target.value })}
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Location on Map
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Click on the map to choose your location, or use your current device location.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {locating ? "Getting Location..." : "Use My Current Location"}
            </button>

            <button
              type="button"
              onClick={() => setShowMapPicker((prev) => !prev)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {showMapPicker ? "Hide Map Picker" : "Pick on Map"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                value={form.latitude}
                onChange={(e) =>
                  setForm({ ...form, latitude: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
              />
            </div>
          </div>

          {showMapPicker ? (
            <ProfileLocationPickerMap
              latitude={
                form.latitude === "" ? undefined : Number(form.latitude)
              }
              longitude={
                form.longitude === "" ? undefined : Number(form.longitude)
              }
              onPick={handleMapPick}
            />
          ) : null}
        </div>

        {message && (
          <p
            className={`text-xs font-medium ${
              message.type === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D04F51] hover:bg-[#BA4547] text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default PersonalInfoCard;