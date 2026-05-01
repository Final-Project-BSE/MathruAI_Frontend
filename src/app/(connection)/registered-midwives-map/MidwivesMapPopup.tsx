"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPinned, X } from "lucide-react";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";
import type { Role } from "@/app/api/user-assign/types";
import RegisteredUsersMapPage from "@/app/(connection)/components/midwife-map/RegisteredUsersMapPage";

type Props = {
  open: boolean;
  onClose: () => void;
};

const VALID_ROLES: Role[] = [
  "MIDWIFE",
  "HOPE_TO_PREGNANT_MOTHER",
  "PREGNANT_MOTHER",
  "POST_PREGNANT_MOTHER",
];

const MOTHER_ROLES: Role[] = [
  "HOPE_TO_PREGNANT_MOTHER",
  "PREGNANT_MOTHER",
  "POST_PREGNANT_MOTHER",
];

function toRoles(input: string[]): Role[] {
  return input.filter((role): role is Role =>
    VALID_ROLES.includes(role as Role)
  );
}

export default function MidwivesMapPopup({ open, onClose }: Props) {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadMapData() {
      try {
        setLoading(true);
        setError("");

        const session = await getSession();
        const jwt = session?.user?.token;
        const sessionRoles = session?.user?.roles || [];

        if (!jwt) {
          throw new Error("You are not authenticated. Please sign in again.");
        }

        const validRoles = toRoles(sessionRoles);

        const isMotherSide = validRoles.some((role) =>
          MOTHER_ROLES.includes(role)
        );

        if (!isMotherSide) {
          throw new Error("You do not have permission to view this map.");
        }

        const currentUser = await getcuruser(jwt);

        if (!active) return;

        setUserId(Number(currentUser.id));
        setToken(jwt);
        setRoles(validRoles);
      } catch (err) {
        console.error("Failed to load midwives map:", err);

        if (active) {
          setUserId(null);
          setToken("");
          setRoles([]);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load midwives map."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadMapData();

    return () => {
      active = false;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <MapPinned className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold">Registered Midwives Map</h2>
              <p className="text-sm text-white/90">
                View nearby registered midwives
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white transition hover:bg-white/20"
            aria-label="Close midwives map popup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#fed2cc] p-4 md:p-6">
          {loading ? (
            <div className="flex min-h-[650px] items-center justify-center text-[#d04f51]">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading midwives map...
            </div>
          ) : error ? (
            <div className="flex min-h-[650px] items-center justify-center rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : userId !== null && token ? (
            <div className="min-h-[650px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <RegisteredUsersMapPage
                userId={userId}
                token={token}
                roles={roles}
                mode="patient-midwives"
              />
            </div>
          ) : (
            <div className="flex min-h-[650px] items-center justify-center rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Unable to load midwives map.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}