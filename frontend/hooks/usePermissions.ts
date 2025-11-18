"use client";

import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      // Fetch user permissions from API
      // For now, we'll use role-based permissions
      fetchPermissions();
    }
  }, [user]);

  const fetchPermissions = async () => {
    try {
      // This endpoint should return user's permissions
      // For now, we'll derive from role
      const rolePermissions: Record<string, string[]> = {
        admin: [
          "inbox:read",
          "inbox:write",
          "inbox:assign",
          "tickets:create",
          "tickets:read",
          "tickets:update",
          "tickets:delete",
          "tickets:assign",
          "users:create",
          "users:read",
          "users:update",
          "users:delete",
          "reports:view",
          "reports:export",
          "settings:view",
          "settings:edit",
          "automation:create",
          "automation:read",
          "automation:update",
          "automation:delete",
        ],
        supervisor: [
          "inbox:read",
          "inbox:write",
          "inbox:assign",
          "tickets:read",
          "tickets:update",
          "tickets:assign",
          "users:read",
          "reports:view",
          "reports:export",
          "settings:view",
          "automation:read",
          "automation:update",
        ],
        agent: [
          "inbox:read",
          "inbox:write",
          "tickets:create",
          "tickets:read",
          "tickets:update",
          "reports:view",
        ],
        technician: ["tickets:read", "tickets:update", "reports:view"],
      };

      if (user?.role) {
        setPermissions(rolePermissions[user.role] || []);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some((perm) => permissions.includes(perm));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every((perm) => permissions.includes(perm));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}

