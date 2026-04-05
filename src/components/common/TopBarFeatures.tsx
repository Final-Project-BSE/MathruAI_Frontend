"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, FileHeart, MapPinned, Menu, MessageCircle, Settings } from "lucide-react";
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

const languages = ["EN", "සිං", "த"] as const;

export default function TopBarFeatures({
    avatarUrl = "/images/reproductive/repro2.png",
}: TopBarFeaturesProps) {
    const [me, setMe] = useState<UserResponseDto | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<(typeof languages)[number]>("EN");
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);

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
        return me.firstName;
    }, [me]);

    const userEmail = useMemo(() => {
        if (!me) return "—";
        return me.email;
    }, [me]);

    return (
        <div className="w-full mb-6">
            <div
                className="
                    flex w-full items-center justify-between gap-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm
                    sm:rounded-full sm:px-4 sm:py-3
                    lg:gap-4
                "
            >
                {/* Left side */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    {/* >= 724px feature links */}
                    <div className="hidden min-[724px]:flex min-w-0 flex-wrap items-center gap-2 lg:flex-nowrap">
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
                                    <Icon className="h-5 w-5 shrink-0 min-[1250px]:h-4 min-[1250px]:w-4" />
                                    <span className="hidden min-[1250px]:inline">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* < 724px mobile menu */}
                    <div className="relative min-[724px]:hidden">
                        <button
                            onClick={() => setIsMobileFeaturesOpen((prev) => !prev)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {isMobileFeaturesOpen && (
                            <div className="absolute left-0 top-full z-20 mt-2 min-w-[180px] rounded-xl border border-neutral-200 bg-white p-1 shadow-md">
                                {features.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsMobileFeaturesOpen(false)}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden h-10 w-px shrink-0 bg-neutral-200 lg:block" />

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                    <button
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 sm:h-11 sm:w-11"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                    </button>

                    {/* Desktop / >=1350px */}
                    <div className="hidden min-[1350px]:flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-1">
                        {languages.map((lang) => {
                            const isActive = selectedLanguage === lang;

                            return (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={
                                        isActive
                                            ? "rounded-full bg-[#d04f51] px-2.5 py-1.5 text-xs font-medium text-white sm:px-3"
                                            : "rounded-full px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 sm:px-3"
                                    }
                                >
                                    {lang}
                                </button>
                            );
                        })}
                    </div>

                    {/* <1350px */}
                    <div className="relative min-[1350px]:hidden">
                        <button
                            onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                            className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                            aria-label="Select language"
                        >
                            {selectedLanguage}
                        </button>

                        {isLanguageMenuOpen && (
                            <div className="absolute right-0 top-full z-20 mt-2 min-w-[72px] rounded-xl border border-neutral-200 bg-white p-1 shadow-md">
                                {languages.map((lang) => {
                                    const isActive = selectedLanguage === lang;

                                    return (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setSelectedLanguage(lang);
                                                setIsLanguageMenuOpen(false);
                                            }}
                                            className={
                                                isActive
                                                    ? "w-full rounded-lg bg-[#d04f51] px-3 py-2 text-left text-xs font-medium text-white"
                                                    : "w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                                            }
                                        >
                                            {lang}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden h-10 w-px shrink-0 bg-neutral-200 lg:block" />

                {/* Profile */}
                <button
                    className="
                        flex min-w-0 shrink-0 items-center gap-3 rounded-full pl-1 pr-2 transition hover:bg-neutral-50
                    "
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-200 sm:h-12 sm:w-12">
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
                        <p className="hidden truncate text-sm font-semibold text-neutral-900 min-[1024px]:block">
                            {fullname}
                        </p>
                        <p className="hidden truncate text-[9px] text-neutral-500 min-[1024px]:block">
                            {userEmail}
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}