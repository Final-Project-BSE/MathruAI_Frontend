"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch('/api/auth/check-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ allowedRoles }),
        });

        const data = await response.json();
        
        if (!data.hasAccess) {
          setHasAccess(false);
        } else {
          setHasAccess(true);
        }
      } catch (error) {
        console.error('Role check error:', error);
        setHasAccess(false);
      }
    }

    checkAccess();
  }, [allowedRoles]);

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return fallback || <div>Access Denied</div>;
  }

  return <>{children}</>;
}
