"use client";

import Link from "next/link";

import Logo from "@/components/common/Logo";
import { cn } from "@/lib/utils";

interface CardWrapperProps {
  logo: boolean;
  label: string;
  title: string;
  backButtonTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  titleClass: string;
  headerTexts: string;
  className: string;
  children: React.ReactNode;
}

const CardWrapper = ({
  logo,
  label,
  title,
  backButtonHref,
  backButtonTitle,
  backButtonLabel,
  titleClass,
  headerTexts,
  className,
  children,
}: CardWrapperProps) => {
  return (
    <div
      className={cn(
        `flex flex-col shadow-none w-full mx-auto p-[15px] 3xl:p-5 h-[376px] 3xl:h-[507px] my-auto border-none`,
        className
      )}
    >
      <Logo
        className={`w-[135px] 3xl:w-[180px] h-auto ${logo ? "" : "hidden"}`}
      />
      <div
        className={cn(
          `w-full flex gap-[7.5px] 3xl:gap-5 flex-col ${
            logo ? "mt-[68px] 3xl:mt-[90px]" : ""
          }`,
          headerTexts
        )}
      >
        <p
          className={cn(
            `text-black font-semibold text-[18px] 3xl:text-2xl/[24px]`,
            titleClass
          )}
        >
          {title}
        </p>
        <p className="text-[12px] 3xl:text-base">{label}</p>
      </div>
      <div className="flex flex-col mt-[18.75px] 3xl:mt-[25px] h-full">
        {children}
      </div>
      <div className="w-full font-normal text-sm flex items-center justify-center mt-4 3xl:mt-5 space-x-1">
        <span className="text-foreground">{backButtonTitle}</span>
        <Link
          href={backButtonHref}
          className="text-black font-semibold text-sm"
        >
          {backButtonLabel}
        </Link>
      </div>
    </div>
  );
};

export default CardWrapper;
