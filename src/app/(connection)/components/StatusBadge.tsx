"use client";

import { getRequestStatusClass } from "./utils";

type Props = {
  status?: string;
  label?: string;
};

export default function StatusBadge({ status, label }: Props) {
  return <span className={getRequestStatusClass(status)}>{label || status || "-"}</span>;
}
