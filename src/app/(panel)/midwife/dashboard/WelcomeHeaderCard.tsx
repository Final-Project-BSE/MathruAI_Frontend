export default function WelcomeHeaderCard() {
  return (
    <div className="w-full px-3 sm:px-4">
      <div className="w-full rounded-[20px] px-4 py-4 shadow-sm sm:px-6 sm:py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs text-white/60 sm:text-sm">
              Let&apos;s Rock today.
            </p>

            <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[26px] md:text-[30px] lg:text-[32px]">
              <span className="block sm:inline">Welcome Back, Masud A.</span>{" "}
              <span className="inline-block">👋</span>
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end">
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#171717] shadow-sm sm:h-12 sm:w-12 sm:text-xl">
                19
              </div>

              <div className="leading-tight text-white">
                <div className="text-xs font-medium text-white/60">Tue.</div>
                <div className="text-sm font-semibold sm:text-base">
                  December
                </div>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-white/15 lg:block" />

            <button className="w-full rounded-full bg-[#ef8354] px-5 py-3 text-xs font-medium text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:px-6">
              Show my Task
            </button>

            <button
              aria-label="Open menu"
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/80 text-neutral-700 shadow-sm md:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h8M8 12h8M8 17h8"
                />
                <rect x="4" y="4" width="16" height="16" rx="4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}