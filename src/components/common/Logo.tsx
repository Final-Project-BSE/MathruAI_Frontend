import React from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

const Logo = ({
  className,
}: {
  className?: string;
  classLink?: string;
}) => {
  return (
      <Image
        src="/images/logo.jpeg"
        alt="Logo"
        width={400}
        height={400}
        className={cn("w-auto h-auto object-contain", className)}
      />
  );
};

export default Logo;
