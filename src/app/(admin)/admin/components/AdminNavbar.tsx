"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Database,
  LogOut,
  MapPinned,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { logout } from "@/lib/authentication";
import ProtectedImage from "@/lib/ProtectedImage";

type CurrentUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
};

type Props = {
  token: string;
  currentUser: CurrentUser;
};

const navLinks = [
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Map", href: "/admin/map", icon: MapPinned },
  { name: "Knowledge Base", href: "/admin/knowledge-base", icon: Database },
];

function fullName(user: CurrentUser) {
  return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Admin";
}

function initials(user: CurrentUser) {
  const first = user.firstName?.trim()?.[0] ?? "";
  const last = user.lastName?.trim()?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "A";
}

export default function AdminNavbar({ token, currentUser }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const name = useMemo(() => fullName(currentUser), [currentUser]);
  const avatarText = useMemo(() => initials(currentUser), [currentUser]);

  const filteredLinks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? navLinks.filter((link) => link.name.toLowerCase().includes(q))
      : navLinks;
  }, [query]);

  async function handleLogout() {
    setProfileOpen(false);
    setMobileOpen(false);

    try {
      await logout();
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }

      router.push("/sign-in");
      router.refresh();
    }
  }

  const avatarFallback = (
    <div className="flex h-full w-full items-center justify-center bg-[#d04f51] text-xs font-bold text-white">
      {avatarText}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#d04f51]/15 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-[58px] max-w-7xl items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d04f51]/20 bg-[#fff2f2] text-[#d04f51] lg:hidden"
            aria-label="Open admin menu"
          >
            <Menu size={18} />
          </button>

          <Link
            href="/admin/users"
            className="flex min-w-0 items-center gap-3 rounded-2xl pr-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d04f51] text-white">
              <Logo />
            </div>

            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold text-zinc-950">
                Mathru AI Admin
              </p>
              <p className="truncate text-[10px] font-medium text-[#d04f51]">
                System Control Center
              </p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-[#d04f51]/15 bg-[#fff7f7] p-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                      active
                        ? "bg-[#d04f51] text-white shadow-sm"
                        : "text-zinc-600 hover:bg-white hover:text-[#d04f51]"
                    }`}
                  >
                    <Icon size={14} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="ml-auto hidden w-[280px] items-center rounded-full border border-[#d04f51]/15 bg-white px-3 py-2 shadow-sm md:flex">
            <Search size={14} className="text-[#d04f51]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search admin pages..."
              className="ml-2 w-full bg-transparent text-xs text-zinc-800 outline-none placeholder:text-zinc-400"
            />
            {query ? (
              <div className="absolute right-28 top-[70px] z-50 w-[280px] rounded-2xl border border-[#d04f51]/15 bg-white p-2 shadow-xl">
                {filteredLinks.length ? (
                  filteredLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.href}
                        type="button"
                        onClick={() => {
                          setQuery("");
                          router.push(link.href);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-[#fff2f2]"
                      >
                        <Icon size={15} className="text-[#d04f51]" />
                        {link.name}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-zinc-500">
                    No admin page found.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="flex items-center gap-2 rounded-full border border-[#d04f51]/15 bg-white px-2 py-1 shadow-sm hover:bg-[#fff7f7]"
            >
              <div className="h-8 w-8 overflow-hidden rounded-full">
                <ProtectedImage
                  src={currentUser.profileImageUrl || ""}
                  token={token}
                  alt={name}
                  fallback={avatarFallback}
                  loadingFallback={avatarFallback}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="hidden min-w-0 text-left leading-tight sm:block">
                <p className="max-w-[135px] truncate text-[11px] font-semibold text-zinc-900">
                  {name}
                </p>
                <p className="max-w-[135px] truncate text-[9px] text-zinc-500">
                  {currentUser.email || "Admin"}
                </p>
              </div>

              <ChevronDown
                size={13}
                className={`text-[#d04f51] transition ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen ? (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-52 rounded-2xl border border-[#d04f51]/15 bg-white p-2 shadow-xl">
                <div className="mb-1 rounded-xl bg-[#fff2f2] px-3 py-2">
                  <p className="text-xs font-bold text-zinc-950">{name}</p>
                  <p className="truncate text-[10px] text-zinc-500">
                    {currentUser.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/admin/users")}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-zinc-700 hover:bg-[#fff2f2]"
                >
                  <Settings size={14} className="text-[#d04f51]" />
                  Admin Settings
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/40 transition ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close admin menu overlay"
        />

        <aside
          className={`absolute left-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl transition-transform ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#d04f51]/15 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d04f51] text-white">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Admin Dashboard</p>
                <p className="text-xs text-zinc-500">Mathru AI</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl p-2 text-zinc-500 hover:bg-[#fff2f2]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-1 p-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;

              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push(link.href);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                    active
                      ? "bg-[#d04f51] text-white"
                      : "text-zinc-700 hover:bg-[#fff2f2]"
                  }`}
                >
                  <Icon size={17} />
                  {link.name}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-600"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
