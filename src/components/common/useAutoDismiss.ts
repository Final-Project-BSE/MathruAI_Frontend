"use client";

import { useEffect, useState } from "react";

export function useAutoDismiss(value: string, delay = 5000) {
  const [visibleValue, setVisibleValue] = useState(value);

  useEffect(() => {
    if (!value) {
      setVisibleValue("");
      return;
    }

    setVisibleValue(value);

    const timer = setTimeout(() => {
      setVisibleValue("");
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return visibleValue;
}