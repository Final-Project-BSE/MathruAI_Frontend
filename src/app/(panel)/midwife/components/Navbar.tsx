"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Bell,
  Search,
  Settings,
  Lock,
  X,
  LayoutGrid,
  BarChart3,
  Wallet,
  FileText,
  Activity,
  Menu,
  LogOut,
  MessageSquare,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { logout } from "@/lib/authentication";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Dashboard", href: "#", icon: LayoutGrid },
  { name: "Sample", href: "#", icon: BarChart3 },
  { name: "Sample", href: "#", icon: Activity },
  { name: "Three Posha", href: "#", icon: FileText },
  { name: "Analytics", href: "#", icon: Wallet },
];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navLinks;

    return navLinks.filter((item) => item.name.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!searchOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 180);

    return () => clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
        setSelectedIndex(0);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setProfileDropdownOpen(false);
        setSelectedIndex(0);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSearchToggle() {
    setSearchOpen((prev) => !prev);
  }

  function handleSelectItem(href: string) {
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setQuery("");
    setSelectedIndex(0);
    router.push(href);
  }

  async function handleLogout() {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);

    await logout();
    router.push("/sign-in");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!filteredItems.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSelectItem(filteredItems[selectedIndex].href);
    }

    if (e.key === "Escape") {
      setSearchOpen(false);
      setSelectedIndex(0);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/95 px-3 py-2 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/80 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="flex h-[52px] min-w-0 items-center gap-3 pr-1 sm:pr-2 lg:border-r lg:border-white/10 lg:px-4">
              <Link href="#" className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-black">
                  <Logo />
                </div>

                <div className="min-w-0 leading-tight">
                  <p className="truncate text-[13px] font-semibold text-white">
                    Mathru AI
                  </p>
                  <p className="truncate text-[9px] text-white/50">
                    Care You Trust
                  </p>
                </div>
              </Link>
            </div>

            <div className="hidden h-[52px] items-center gap-3 border-r border-white/10 px-4 lg:flex">
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 pr-3 transition hover:bg-white/[0.05]"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="menu"
                >
                  <div className="h-7 w-7 overflow-hidden rounded-full ring-1 ring-[#f5c26b]/50">
                    <div className="flex h-full w-full items-center justify-center bg-[#2a3145] text-[10px] font-semibold text-white">
                      R
                    </div>
                  </div>

                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-white/50">@ryan997</span>
                    </div>
                    <p className="text-[12px] font-medium text-white">
                      Ryan Crawford
                    </p>
                  </div>

                  <ChevronDown
                    size={12}
                    className={`text-white/70 transition-transform ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+10px)] z-[999] w-40 rounded-2xl border border-white/10 bg-black p-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-white/75 transition hover:bg-white/5 hover:text-white"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                        <LogOut size={15} />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium">Logout</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-[#d9c2ff] px-5 py-2 text-[12px] font-medium text-[#121212] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition hover:brightness-105"
              >
                <span>Sample</span>
                <Lock size={12} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <nav className="hidden min-w-0 flex-1 items-center justify-center px-2 lg:flex">
            <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/[0.02] px-2 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {navLinks.map((item, index) => {
                const active = index === 0;

                return (
                  <Link
                    key={`${item.name}-${index}`}
                    href={item.href}
                    className={`shrink-0 rounded-full px-4 py-2 text-center text-[11px] font-medium transition ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/55 hover:bg-white/5 hover:text-white"
                    }`}
                    title={item.name}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="ml-auto flex h-[52px] shrink-0 items-center gap-2 bg-black px-1 sm:gap-3 sm:px-2 lg:px-4">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-xl bg-[#d9c2ff] px-3 py-2 text-[11px] font-medium text-[#121212] transition hover:brightness-105 md:inline-flex lg:hidden"
            >
              <span>Deposit</span>
              <Lock size={12} strokeWidth={2.2} />
            </button>

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Bell size={14} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#8b5cf6] px-1 text-[8px] font-semibold text-white">
                2
              </span>
            </button>

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >
              <MessageSquare size={14} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#8b5cf6] px-1 text-[8px] font-semibold text-white">
                1
              </span>
            </button>

            <div ref={searchRef} className="relative flex items-center">
              <div
                className={`absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden transition-all duration-300 ease-out ${
                  searchOpen
                    ? "w-[min(320px,calc(100vw-24px))] opacity-100"
                    : "pointer-events-none w-9 opacity-0 sm:w-10"
                }`}
              >
                <div
                  className={`flex h-10 items-center rounded-full border border-white/10 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out ${
                    searchOpen ? "translate-x-0 scale-100" : "translate-x-3 scale-95"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center text-white/75 hover:text-white"
                    aria-label="Close search"
                  >
                    <Search size={14} />
                  </button>

                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search assets, pages, rewards..."
                    className="h-full w-full bg-transparent pr-2 text-[12px] text-white outline-none placeholder:text-white/35"
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="mr-2 flex h-6 w-6 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                      aria-label="Clear search"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div
                  className={`absolute right-0 top-12 w-full rounded-2xl border border-white/10 bg-black p-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 ease-out ${
                    searchOpen
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="mb-2 px-2 pt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">
                    Search Results
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item, index) => {
                        const Icon = item.icon;
                        const active = index === selectedIndex;

                        return (
                          <button
                            key={`${item.name}-${index}`}
                            type="button"
                            onClick={() => handleSelectItem(item.href)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                              active
                                ? "bg-white/10 text-white"
                                : "text-white/75 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                              <Icon size={15} />
                            </span>

                            <div className="min-w-0">
                              <p className="truncate text-[12px] font-medium">
                                {item.name}
                              </p>
                              <p className="truncate text-[10px] text-white/40">
                                Jump to section
                              </p>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-xl px-3 py-4 text-center text-[11px] text-white/45">
                        No results found for “{query}”
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSearchToggle}
                className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/75 transition hover:text-white"
                aria-label="Toggle search"
              >
                <Search size={14} />
              </button>
            </div>

            <button
              type="button"
              className="hidden h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 text-white/80 transition hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              <span className="text-[10px]">Settings</span>
              <Settings size={13} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-[88%] max-w-[360px] border-r border-white/10 bg-black shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <Link href="#" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-black">
                  <Logo />
                </div>

                <div className="leading-tight">
                  <p className="text-[13px] font-semibold text-white">Mathru AI</p>
                  <p className="text-[9px] text-white/50">Care You Trust</p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="border-b border-white/10 px-4 py-4">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 transition hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-[#f5c26b]/50">
                    <div className="flex h-full w-full items-center justify-center bg-[#2a3145] text-[11px] font-semibold text-white">
                      R
                    </div>
                  </div>

                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-white/50">@ryan997</span>
                      <span className="rounded bg-white/10 px-1 py-[1px] text-[8px] font-medium text-white/70">
                        PRO
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-white">
                      Ryan Crawford
                    </p>
                  </div>
                </div>

                <ChevronDown size={14} className="text-white/70" />
              </button>

              <button
                type="button"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d9c2ff] px-4 py-3 text-[13px] font-medium text-[#121212] transition hover:brightness-105"
              >
                <span>Deposit</span>
                <Lock size={13} strokeWidth={2.2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {navLinks.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === 0;

                  return (
                    <button
                      key={`${item.name}-${index}`}
                      type="button"
                      onClick={() => handleSelectItem(item.href)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
                        <Icon size={17} />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium">
                          {item.name}
                        </p>
                        <p className="truncate text-[11px] text-white/40">
                          Open section
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 border-t border-white/10 p-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] text-white/80 transition hover:bg-white/[0.06] hover:text-white"
              >
                <Settings size={15} />
                <span>Settings</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-300 transition hover:bg-red-500/15 hover:text-red-200"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
