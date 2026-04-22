"use client";

import { cn } from "./utils";

type Props = {
  isMidwife: boolean;
  isMotherSide: boolean;
  theme: "light" | "dark";
};

export default function AssignmentPageHeader({
  isMidwife,
  isMotherSide,
  theme,
}: Props) {
  const isLightTheme = theme === "light";

  const title = isMidwife
    ? "Mother Connectivity & Assignment Management"
    : isMotherSide
    ? "Midwife Connectivity & Assignment"
    : "Connectivity & Assignment";

  const description = isMidwife
    ? "Search mothers by district/MOH, map them, manage requests, review assignments and update assigned mother details."
    : isMotherSide
    ? "Search midwives by district/MOH, view available midwives on the map, manage connection requests and review your assigned midwife."
    : "Manage connection requests and assignments.";

  return (
    <div className="mb-6">
      <h1
        className={cn(
          "text-md font-bold tracking-tight",
          isLightTheme ? "text-gray-900" : "text-white"
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "mt-1 max-w-3xl text-xs",
          isLightTheme ? "text-gray-600" : "text-gray-400"
        )}
      >
        {description}
      </p>
    </div>
  );
}