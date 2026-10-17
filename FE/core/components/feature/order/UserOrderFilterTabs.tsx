"use client";

import React from "react";
import { Button } from "@/core/components/ui/button";
import type { OrderStatusTab } from "@/core/hooks/useUserOrders";

interface UserOrderFilterTabsProps {
  activeTab: OrderStatusTab;
  onSelectTab: (tab: OrderStatusTab) => void;
  counts: Record<OrderStatusTab, number>;
}

const TABS: { id: OrderStatusTab; label: string }[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING", label: "Chờ xử lý" },
  { id: "SHIPPING", label: "Đang giao" },
  { id: "DELIVERED", label: "Đã giao" },
  { id: "CANCELLED", label: "Đã hủy" },
];

export const UserOrderFilterTabs: React.FC<UserOrderFilterTabsProps> = ({
  activeTab,
  onSelectTab,
  counts,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
      {TABS.map((tab) => {
        const count = counts[tab.id] || 0;
        const isActive = activeTab === tab.id;

        return (
          <Button
            key={tab.id}
            type="button"
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onSelectTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <span>{tab.label}</span>
            {count > 0 && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default UserOrderFilterTabs;
