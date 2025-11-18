"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

interface CanProps {
  permission?: string;
  role?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ permission, role, children, fallback = null }: CanProps) {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  if (role && user?.role !== role) {
    return <>{fallback}</>;
  }

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

