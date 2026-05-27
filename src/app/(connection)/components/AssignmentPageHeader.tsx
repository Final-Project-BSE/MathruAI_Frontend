"use client";

import type { AssignmentTranslations } from "./assignmentLang";
import { cn } from "./utils";

type Props = {
  isMidwife: boolean;
  isMotherSide: boolean;
  theme: "light" | "dark";
  labels: AssignmentTranslations["header"];
};

export default function AssignmentPageHeader({
  isMidwife,
  isMotherSide,
  theme,
  labels,
}: Props) {
  const isLightTheme = theme === "light";

  const title = isMidwife
    ? labels.midwifeTitle
    : isMotherSide
    ? labels.motherTitle
    : labels.defaultTitle;

  const description = isMidwife
    ? labels.midwifeDescription
    : isMotherSide
    ? labels.motherDescription
    : labels.defaultDescription;

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
