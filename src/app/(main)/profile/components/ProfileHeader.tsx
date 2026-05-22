"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { ProfileResponse } from "@/app/api/profile/types";
import ProtectedImage from "../../../../lib/ProtectedImage";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface Props {
  profile: ProfileResponse | null;
  token: string;
}

const roleFallbackLabels: Record<string, string> = {
  HOPE_TO_PREGNANT_MOTHER: "Hope To Pregnant Mother",
  PREGNANT_MOTHER: "Pregnant Mother",
  POST_PREGNANT_MOTHER: "Post Pregnant Mother",
};

const ProfileHeader = ({ profile, token }: Props) => {
  const { language, t } = useLanguage();

  const initials = profile
    ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : "??";

  const [translatedDynamic, setTranslatedDynamic] = useState({
    fullName: "",
    email: "",
    address: "",
    district: "",
    mohArea: "",
    roles: [] as string[],
  });

  const dynamicSource = useMemo(() => {
    const fullName = profile
      ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
      : "";

    return {
      fullName,
      email: profile?.email || "",
      address: profile?.address || "",
      district: profile?.district || "-",
      mohArea: profile?.mohArea || "-",
      roles:
        profile?.roles?.map(
          (role) => t.profile.changeRole.stages[role] || roleFallbackLabels[role] || role
        ) || [],
    };
  }, [profile, t.profile.changeRole.stages]);

  useEffect(() => {
    let cancelled = false;

    const translateDynamicData = async () => {
      if (language === "en") {
        setTranslatedDynamic(dynamicSource);
        return;
      }

      const [fullName, email, address, district, mohArea, ...roles] =
        await Promise.all([
          translateText(dynamicSource.fullName, language),
          translateText(dynamicSource.email, language),
          translateText(dynamicSource.address, language),
          translateText(dynamicSource.district, language),
          translateText(dynamicSource.mohArea, language),
          ...dynamicSource.roles.map((role) => translateText(role, language)),
        ]);

      if (!cancelled) {
        setTranslatedDynamic({
          fullName,
          email,
          address,
          district,
          mohArea,
          roles,
        });
      }
    };

    void translateDynamicData();

    return () => {
      cancelled = true;
    };
  }, [language, dynamicSource]);

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
            {translatedDynamic.fullName || "-"}
          </h1>

          <p className="text-rose-100 mt-1">
            {translatedDynamic.email || "-"}
          </p>

          {profile?.address && (
            <p className="text-rose-100 text-sm mt-1">
              {translatedDynamic.address}
            </p>
          )}

          <div className="mt-2 space-y-1 text-sm text-rose-100">
            <p>
              {t.profile.header.district}: {translatedDynamic.district || "-"} |{" "}
              {t.profile.header.mohArea}: {translatedDynamic.mohArea || "-"}
            </p>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {translatedDynamic.roles.map((role) => (
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