"use client";

import AdminHeader from "@/core/components/feature/admin/layout/AdminHeader";
import AdminSidebar from "@/core/components/feature/admin/layout/AdminSidebar";
import { Box } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type MyTokenPayload = {
  sub: string;
  roles: string[];
  exp: number;
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decoded = jwtDecode<MyTokenPayload>(accessToken);
      const isAdminCheck = decoded.roles.includes("ADMIN");
      setIsAdmin(() => isAdminCheck);

      if (decoded.exp * 1000 < Date.now()) {
        setIsAdmin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        router.replace("/login");
      }

      if (!isAdmin) {
        router.replace("/");
      }
    } else {
      router.replace("/login");
    }
  }, [isAdmin, router]);

  if (isAdmin) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            bgcolor: "#fafbfc",
            minHeight: "100vh",
          }}
        >
          <AdminSidebar />

          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <AdminHeader />

            {/* Main Content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: { xs: 2, sm: 3 },
                bgcolor: "#fafbfc",
                minHeight: "calc(100vh - 64px)",
                overflow: "auto",
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  return <div>Đang kiểm tra quyền truy cập...</div>;
}
