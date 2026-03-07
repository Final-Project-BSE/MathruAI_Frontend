"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, FileHeart, MapPinned, MessageCircle, Settings } from "lucide-react";
import { getcuruser } from "@/app/api/user/api";
import type { UserResponseDto } from "@/app/api/user/types";
import { useEffect, useMemo, useState } from "react";

type TopBarFeaturesProps = {
    name?: string;
    email?: string;
    avatarUrl?: string;
};

const features = [
    { label: "Messages", href: "/messages", icon: MessageCircle },
    { label: "Midwives Map", href: "/midwives-map", icon: MapPinned },
    { label: "Health Records", href: "/health-records", icon: FileHeart },
    { label: "Settings", href: "/settings", icon: Settings },

];

export default function TopBarFeatures({
    avatarUrl = "/images/reproductive/repro2.png",
}: TopBarFeaturesProps) {

    const [me, setMe] = useState<UserResponseDto | null>(null);

    const topbannerImageUrl = "/images/reproductive/repro1.png";

    useEffect(() => {
        const loadMe = async () => {
            try {
                const { getSession } = await import("@/lib/authentication");
                const session = await getSession();

                const token = session?.user?.token;
                if (!token) return;

                const user = await getcuruser(token);
                setMe(user);
            } catch (e) {
                console.error("Failed to load current user:", e);
            }
        };

        loadMe();
    }, []);

    const fullname = useMemo(() => {
        if (!me) return "—";
        return `${me.firstName} ${me.lastName}`.trim();
    }, [me]);

    const userEmail = useMemo(() => {
        if (!me) return "—";
        return me.email;
    }, [me]);

    return (
        <div className="w-full mb-6">
            <div
                className="
          flex w-full flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm
          sm:rounded-full sm:px-4 sm:py-3
          lg:flex-row lg:items-center lg:justify-between
        "
            >
                {/* Left side */}
                <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
                    {/* Feature links */}
                    <div
                        className="
              flex min-w-0 flex-wrap items-center gap-2
              lg:flex-nowrap
            "
                    >
                        {features.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="
                    inline-flex items-center gap-2 rounded-full px-3 py-2
                    text-sm font-medium text-neutral-700 transition hover:bg-neutral-100
                    whitespace-nowrap
                  "
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Divider desktop */}
                <div className="hidden h-10 w-px bg-neutral-200 lg:block" />

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 sm:h-11 sm:w-11"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                    </button>

                    <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-1">
                        <button className="rounded-full bg-[#d04f51] px-2.5 py-1.5 text-xs font-medium text-white sm:px-3">
                            EN
                        </button>
                        <button className="rounded-full px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 sm:px-3">
                            සිං
                        </button>
                        <button className="rounded-full px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 sm:px-3">
                            த
                        </button>
                    </div>
                </div>
                <div className="hidden h-10 w-px bg-neutral-200 lg:block" />

                {/* Profile */}
                <button
                    className="
            flex min-w-0 items-center gap-3 rounded-full pl-1 pr-2 transition hover:bg-neutral-50
            self-start lg:self-auto
          "
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-200 sm:h-12 sm:w-12">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white sm:h-10 sm:w-10">
                            <Image
                                src={avatarUrl}
                                alt={fullname}
                                fill
                                className="object-cover"
                                sizes="40px"
                            />
                        </div>
                    </div>

                    <div className="min-w-0 text-left leading-tight">
                        <p className="truncate text-sm font-semibold text-neutral-900">{fullname}</p>
                        <p className="hidden truncate text-xs text-neutral-500 sm:block">{userEmail}</p>
                    </div>
                </button>
            </div>
        </div>
    );
}