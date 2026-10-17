"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { getShippingPolicies } from "@/core/constants";

export const ShippingInfo: React.FC = () => {
  const policies = getShippingPolicies();

  return (
    <Card className="border border-border/60 bg-card shadow-xs">
      <CardHeader className="border-b border-border/60 px-5 py-3.5">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span>Chính sách giao hàng & cam kết</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-3.5">
        {policies.map((policy, idx) => {
          const Icon = policy.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground leading-snug">
                  {policy.title}
                </p>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  {policy.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ShippingInfo;
