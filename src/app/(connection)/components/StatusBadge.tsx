"use client";

import { getRequestStatusClass } from "./utils";

type Props = {
  status?: string;
};

export default function StatusBadge({ status }: Props) {
  return <span className={getRequestStatusClass(status)}>{status || "-"}</span>;
}