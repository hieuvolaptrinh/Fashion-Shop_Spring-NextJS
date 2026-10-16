"use client";

import React from "react";
import { useAdminDashboard } from "@/core/hooks/useAdminDashboard";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStatsCards } from "./DashboardStatsCards";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardRecentOrders } from "./DashboardRecentOrders";
import { DashboardQuickActions } from "./DashboardQuickActions";

export function DashboardManager() {
  const { loading, mounted, data, refresh } = useAdminDashboard();
  const {
    totalRevenue,
    totalOrders,
    totalProducts,
    recentOrders,
    orderStatusData,
    revenueData,
  } = data;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in-50 duration-500">
      {/* 1. Header & Actions */}
      <DashboardHeader loading={loading} onRefresh={refresh} />

      {/* 2. KPI Stats Cards */}
      <DashboardStatsCards
        loading={loading}
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        totalProducts={totalProducts}
      />

      {/* 3. Analytics & Charts */}
      <DashboardCharts
        mounted={mounted}
        revenueData={revenueData}
        orderStatusData={orderStatusData}
      />

      {/* 4. Recent Orders Table */}
      <DashboardRecentOrders loading={loading} orders={recentOrders} />

      {/* 5. Quick Actions Footer */}
      <DashboardQuickActions />
    </div>
  );
}

export default DashboardManager;
