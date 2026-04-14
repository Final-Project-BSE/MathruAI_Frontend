"use client";

import React from "react";
import type { ProfileResponse } from "@/app/api/profile/types";
import ProtectedImage from "../../../../lib/ProtectedImage";

interface Props {
  profile: ProfileResponse | null;
  token: string;
}

const ProfileHeader = ({ profile, token }: Props) => {
  const initials = profile
    ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : "??";

  const fallbackAvatar = (
    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold shadow-inner">
      {initials}
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-[#d04f51] to-[#fab0a7] rounded-2xl p-8 text-white shadow-lg">
      <div className="flex items-center gap-6">
        <ProtectedImage
          src={profile?.profileImageUrl}
          token={token}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border border-white/60 shadow-inner"
          fallback={fallbackAvatar}
          loadingFallback={fallbackAvatar}
        />

        <div>
          <h1 className="text-2xl font-bold">
            {profile?.firstName} {profile?.lastName}
          </h1>
          <p className="text-rose-100 mt-1">{profile?.email}</p>

          {profile?.address && (
            <p className="text-rose-100 text-sm mt-1">{profile.address}</p>
          )}

          <div className="mt-2 space-y-1 text-sm text-rose-100">
            <p>
              District: {profile?.district || "-"} | MOH Area: {profile?.mohArea || "-"}
            </p>
            <p>
              Lat: {profile?.latitude ?? "-"} | Lng: {profile?.longitude ?? "-"}
            </p>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {profile?.roles?.map((role) => (
              <span
                key={role}
                className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;