"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminLayoutContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(
  undefined
);

export function AdminLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <AdminLayoutContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleSidebar,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error(
      "useAdminLayout must be used within an AdminLayoutProvider"
    );
  }
  return context;
}
