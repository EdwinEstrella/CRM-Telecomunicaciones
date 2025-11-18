"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;
  const isAuthenticated = !!user;
  const isLoading = status === "loading";

  const logout = async () => {
    const { signOut } = await import("next-auth/react");
    await signOut({ redirect: false });
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    role: user?.role,
  };
}

