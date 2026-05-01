"use client";

import React from "react";
import type { ProfileResponse } from "@/app/api/profile/types";
import ProtectedImage from "../../../../../lib/ProtectedImage";

interface Props {
  profile: ProfileResponse | null;
  token: string;
}

const ProfileHeader = ({ profile, token }: Props) => {
  const initials = profile
    ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : "??";

  const fallbackAvatar = (
    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-black/30 text-3xl font-bold text-white shadow-inner backdrop-blur">
      {initials}
    </div>
  );

  return (
    <div className="rounded-md border border-white/10 bg-[#D04F51]/80 pt-4 pb-4 pr-8 pl-8 text-white shadow-xl shadow-black/40">
      <div className="flex items-center gap-6">
        <ProtectedImage
          src={profile?.profileImageUrl}
          token={token}
          alt="Profile"
          className="h-20 w-20 rounded-full border border-white/40 object-cover shadow-inner"
          fallback={fallbackAvatar}
          loadingFallback={fallbackAvatar}
        />

        <div>
          <h1 className="text-md font-bold text-white">
            {profile?.firstName} {profile?.lastName}
          </h1>

          <p className="mt-1 text-[#fab0a7] text-xs">{profile?.email}</p>

          {profile?.address && (
            <p className="mt-1 text-xs text-zinc-300">{profile.address}</p>
          )}

          <div className="mt-2 space-y-1 text-xs text-zinc-300">
            <p>
              District: {profile?.district || "-"} | MOH Area: {profile?.mohArea || "-"}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {profile?.roles?.map((role) => (
              <span
                key={role}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
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