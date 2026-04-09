"use client";

import { toast } from "sonner";

export const successToast = (title: string) =>
  toast.custom(() => (
    <div className="flex flex-row items-center gap-2.5 lg:gap-[7.5px] 3xl:!gap-2.5 bg-[#4CAF50] p-5 lg:p-[15px] 3xl:!p-4 rounded-[10px] lg:rounded-[7.5px] 3xl:!rounded-[10px]">
      <i className="size-6 lg:size-[18px] 3xl:!size-6 activate-icon text-[#E8F3E3] shrink-0" />
      <p className="text-sm 3xl:!text-base font-semibold text-[#E8F3E3]">
        {title}
      </p>
    </div>
  ));

export const errorToast = (title: string) =>
  toast.custom(() => (
    <div className="flex flex-row items-center gap-2.5 lg:gap-[7.5px] 3xl:!gap-2.5 bg-[#3D3D3D] p-5 lg:p-[15px] 3xl:!p-4 rounded-[10px] lg:rounded-[7.5px] 3xl:!rounded-[10px] max-w-full w-full">
      <i className="size-6 lg:size-[18px] 3xl:!size-6 error-icon text-[#E8F3E3] shrink-0" />
      <p className="text-sm 3xl:!text-base font-semibold text-[#E8F3E3] w-full">
        {title}
      </p>
    </div>
  ));

export const stageUpgradeToast = (
  stageName: string,
  onLogout: () => void | Promise<void>
) => {
  const toastId = toast.custom(
    () => (
      <div className="w-[340px] rounded-xl border border-[#FC60AE] bg-[#FC60AE] p-4 shadow-2xl pointer-events-auto">
        <p className="mb-1 text-base font-semibold text-white">Stage Upgraded</p>
        <p className="text-sm text-white">
          You have upgrate to "{stageName}". please Logout and Relog as "{stageName}".
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={async () => {
              toast.dismiss(toastId);
              await onLogout();
            }}
            className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#210321] hover:bg-gray-100"
          >
            Logout
          </button>
          <button
            type="button"
            onClick={() => toast.dismiss(toastId)}
            className="rounded-md border border-white px-3 py-2 text-xs font-semibold text-white hover:bg-[#E84E9C]"
          >
            Close
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      className:
        "!fixed !left-[58%] !top-1/2 !right-auto !bottom-auto !-translate-x-1/2 !-translate-y-1/2 !m-0 !p-0 !bg-transparent !border-0 !shadow-none",
    }
  );

  return toastId;
};
