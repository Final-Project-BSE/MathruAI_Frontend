import React from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const Logo = ({
  className,
  classLink,
}: {
  className?: string;
  classLink?: string;
}) => {
  return (
    <Link href="/" className={classLink}>
      <Image
        src="/images/logo.jpeg"
        alt="Logo"
        width={400}
        height={400}
        className={cn("w-auto h-auto object-contain", className)}
      />
    </Link>
  );
};

export default Logo;
