"use client";

import type { ReactNode } from "react";
import AdminHeader from "@/core/components/feature/admin/layout/AdminHeader";
import AdminSidebar from "@/core/components/feature/admin/layout/AdminSidebar";
import { AdminLayoutProvider } from "@/core/context/AdminLayoutContext";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/core/hooks/useAdminAuth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Đang xác thực quyền truy cập quản trị...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayoutProvider>
      <div className="flex min-h-screen w-full bg-slate-50/70 dark:bg-slate-950">
        <AdminSidebar />

        <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AdminLayoutProvider>
  );
}
