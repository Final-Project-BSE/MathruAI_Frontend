'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logout } from '@/lib/authentication';

export const successToast = (title: string) =>
  toast.custom(() => (
    <div className="flex flex-row items-center gap-2.5 rounded-[10px] bg-[#4CAF50] p-5 lg:gap-[7.5px] lg:rounded-[7.5px] lg:p-[15px] 3xl:!gap-2.5 3xl:!rounded-[10px] 3xl:!p-4">
      <i className="activate-icon size-6 shrink-0 text-[#E8F3E3] lg:size-[18px] 3xl:!size-6" />
      <p className="text-sm font-semibold text-[#E8F3E3] 3xl:!text-base">
        {title}
      </p>
    </div>
  ));

export const errorToast = (title: string) =>
  toast.custom(() => (
    <div className="flex w-full max-w-full flex-row items-center gap-2.5 rounded-[10px] bg-[#3D3D3D] p-5 lg:gap-[7.5px] lg:rounded-[7.5px] lg:p-[15px] 3xl:!gap-2.5 3xl:!rounded-[10px] 3xl:!p-4">
      <i className="error-icon size-6 shrink-0 text-[#E8F3E3] lg:size-[18px] 3xl:!size-6" />
      <p className="w-full text-sm font-semibold text-[#E8F3E3] 3xl:!text-base">
        {title}
      </p>
    </div>
  ));

type LogoutActionToastProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
};

export const useActionLogoutToast = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore logout API failure and still clear local session
    }

    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    router.push('/sign-in');
    router.refresh();
  };

  const actionLogoutToast = ({
    title,
    description,
    confirmText = 'Logout',
    cancelText = 'Close',
  }: LogoutActionToastProps) => {
    const toastId = toast.custom(
      () => (
        <div className="pointer-events-auto w-[340px] rounded-xl border border-[#d04f51] bg-[#d04f51] p-4 shadow-2xl">
          <div className="space-y-1">
            <p className="text-base font-semibold text-white">{title}</p>
            <div className="text-sm text-white">{description}</div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(toastId);
                await handleLogout();
              }}
              className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#210321] hover:bg-gray-100"
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        className:
          '!fixed !left-1/2 !top-1/2 !right-auto !bottom-auto !m-0 !-translate-x-1/2 !-translate-y-1/2 !border-0 !bg-transparent !p-0 !shadow-none',
      }
    );

    return toastId;
  };

  return { actionLogoutToast };
};