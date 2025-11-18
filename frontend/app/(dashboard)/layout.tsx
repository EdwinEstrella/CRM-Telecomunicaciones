"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/layout/sidebar";

// Lazy load NotificationDropdown - no es crítico para el render inicial
const NotificationDropdown = dynamic(() => import("@/components/notifications/notification-dropdown").then(mod => ({ default: mod.NotificationDropdown })), {
  ssr: false,
  loading: () => <div className="w-8 h-8" />,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-white px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <NotificationDropdown />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user?.name}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
