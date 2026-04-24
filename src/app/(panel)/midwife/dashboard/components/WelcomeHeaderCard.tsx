"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { MapPinned } from "lucide-react";

import Modal from "../../../../(connection)/components/Modal";
import RegisteredUsersMapPage from "../../../../(connection)/components/midwife-map/RegisteredUsersMapPage";

import type { Role } from "../../../../api/user-assign/types";

type Props = {
  userId: number;
  token: string;
  roles: Role[];
};

export default function WelcomeHeaderCard({
  userId,
  token,
  roles,
}: Props) {
  const [openMap, setOpenMap] = useState(false);

  return (
    <>
      <div className="w-full px-3 sm:px-4">
        <div className="w-full rounded-[20px] px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs text-white/60 sm:text-sm">
                Let&apos;s Rock today.
              </p>

              <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.03em] text-white/80 sm:text-[26px] md:text-[30px] lg:text-[32px]">
                <span className="block sm:inline">
                  Welcome Back, Masud A.
                </span>{" "}
                <span className="inline-block">👋</span>
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end">

              <div className="hidden items-center gap-3 md:flex">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-lg font-semibold text-[#171717] shadow-sm sm:h-12 sm:w-12 sm:text-xl">
                  19
                </div>

                <div className="leading-tight text-white/80">
                  <div className="text-xs font-medium text-white/60">Tue.</div>
                  <div className="text-sm font-semibold sm:text-base">
                    December
                  </div>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-white/15 lg:block" />

              <Link
                href="/user-assign"
                className="w-full rounded-full bg-[#ef8354] px-5 py-3 text-center text-xs font-medium text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:px-6"
              >
                Assignment
              </Link>

              <button
                onClick={() => setOpenMap(true)}
                aria-label="Open patients map"
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/80 text-neutral-700 shadow-sm md:flex"
              >
                <MapPinned className="h-5 w-5" />
              </button>

              <button
                aria-label="Open menu"
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/80 text-neutral-700 shadow-sm md:flex"
              >
                <FontAwesomeIcon icon={faBullhorn} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openMap}
        onClose={() => setOpenMap(false)}
        title="Registered Patients Map"
        theme="dark"
      >
        <RegisteredUsersMapPage
          userId={userId}
          token={token}
          roles={roles}
          mode="midwife-patients"
        />
      </Modal>
    </>
  );
}