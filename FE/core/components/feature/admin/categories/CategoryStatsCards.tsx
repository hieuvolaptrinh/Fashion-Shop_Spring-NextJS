"use client";

import React from "react";
import { FolderTree, PackageCheck, AlertCircle, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Skeleton } from "@/core/components/ui/skeleton";

interface CategoryStatsCardsProps {
  stats: {
    total: number;
    withProducts: number;
    empty: number;
    totalProductsCount: number;
  };
  loading?: boolean;
}

export function CategoryStatsCards({ stats, loading = false }: CategoryStatsCardsProps) {
  const cards = [
    {
      title: "Tổng số danh mục",
      value: stats.total,
      suffix: "loại",
      icon: FolderTree,
      iconClass: "bg-primary/10 text-primary",
      description: "Tổng các phân loại sản phẩm trong shop",
    },
    {
      title: "Đang có sản phẩm",
      value: stats.withProducts,
      suffix: "danh mục",
      icon: PackageCheck,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      description: "Danh mục đang hoạt động và có hàng",
    },
    {
      title: "Chưa có sản phẩm",
      value: stats.empty,
      suffix: "danh mục",
      icon: AlertCircle,
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      description: "Danh mục trống chưa gán sản phẩm nào",
    },
    {
      title: "Tổng lượt gán sản phẩm",
      value: stats.totalProductsCount,
      suffix: "lượt",
      icon: Layers,
      iconClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      description: "Tổng số liên kết sản phẩm - danh mục",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className="rounded-2xl border border-border/70 shadow-xs hover:shadow-md transition-shadow bg-card"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {card.suffix}
                  </span>
                </div>
              )}
              <p className="mt-1 text-[11px] text-muted-foreground truncate">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
