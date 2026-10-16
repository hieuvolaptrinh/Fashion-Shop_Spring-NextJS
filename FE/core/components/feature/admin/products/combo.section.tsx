"use client";

import React from "react";
import type { Combo } from "@/core/lib/type";
import { Plus, Trash2, Tag, Percent } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Textarea } from "@/core/components/ui/textarea";
import { formatCurrency } from "@/core/lib/utils";

interface ComboSectionProps {
  combos: Combo[];
  onAddCombo: () => void;
  onRemoveCombo: (index: number) => void;
  onUpdateCombo: (index: number, field: keyof Combo, value: any) => void;
  salePrice: number;
  errors: Record<string, string>;
  isViewing?: boolean;
}

const ComboSection: React.FC<ComboSectionProps> = ({
  combos,
  onAddCombo,
  onRemoveCombo,
  onUpdateCombo,
  salePrice,
  errors,
  isViewing = false,
}) => {
  if (isViewing && combos.length === 0) return null;

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
            <Tag className="h-4 w-4 text-primary" />
            <span>Tùy chọn Gói Combo</span>
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            {isViewing
              ? "Các gói ưu đãi combo hiện có của sản phẩm"
              : "Thêm các gói combo với giá ưu đãi khi khách hàng mua số lượng lớn"}
          </CardDescription>
        </div>
        {!isViewing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddCombo}
            className="rounded-xl gap-1 text-xs h-8"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm Combo</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {combos.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
            Chưa có combo nào. Nhấn "Thêm Combo" để tạo gói giá ưu đãi.
          </div>
        ) : (
          <div className="space-y-4">
            {combos.map((combo, index) => {
              const qtyErr = errors[`combo_${index}_quantity`];
              const priceErr = errors[`combo_${index}_price`];
              const singleTotal = salePrice * combo.quantityInCombo;
              const savings = singleTotal - combo.comboPrice;
              const savingPercent =
                singleTotal > 0 ? ((savings / singleTotal) * 100).toFixed(1) : "0";

              return (
                <div
                  key={index}
                  className="rounded-xl border bg-card p-4 space-y-3 relative group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      Combo #{index + 1}
                    </span>
                    {!isViewing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveCombo(index)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Xóa combo</span>
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">
                        Số lượng trong gói <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        disabled={isViewing}
                        value={combo.quantityInCombo}
                        onChange={(e) =>
                          onUpdateCombo(
                            index,
                            "quantityInCombo",
                            Number(e.target.value)
                          )
                        }
                        className={`h-9 text-xs rounded-xl ${
                          qtyErr ? "border-destructive focus-visible:ring-destructive/20" : ""
                        }`}
                      />
                      {qtyErr && (
                        <p className="text-[11px] text-destructive font-medium">
                          {qtyErr}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium">
                        Giá gói combo (VNĐ) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        disabled={isViewing}
                        value={combo.comboPrice}
                        onChange={(e) =>
                          onUpdateCombo(
                            index,
                            "comboPrice",
                            Number(e.target.value)
                          )
                        }
                        className={`h-9 text-xs rounded-xl ${
                          priceErr ? "border-destructive focus-visible:ring-destructive/20" : ""
                        }`}
                      />
                      {priceErr && (
                        <p className="text-[11px] text-destructive font-medium">
                          {priceErr}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium">
                      Mô tả combo (Tùy chọn)
                    </Label>
                    <Textarea
                      rows={2}
                      disabled={isViewing}
                      value={combo.comboDescription || ""}
                      onChange={(e) =>
                        onUpdateCombo(index, "comboDescription", e.target.value)
                      }
                      placeholder="Ví dụ: Mua 3 tặng 1, Giảm 15% khi mua từ 2 sản phẩm..."
                      className="text-xs rounded-xl min-h-[60px]"
                    />
                  </div>

                  {combo.quantityInCombo > 0 &&
                    combo.comboPrice > 0 &&
                    salePrice > 0 && (
                      <div className="rounded-xl bg-success/15 border border-success/30 p-2.5 text-xs text-success space-y-1">
                        <div className="flex items-center gap-1 font-semibold">
                          <Percent className="h-3.5 w-3.5" />
                          <span>
                            Tiết kiệm: {formatCurrency(savings)} ({savingPercent}%)
                          </span>
                        </div>
                        <div className="text-[11px] opacity-90">
                          Giá bán lẻ: {formatCurrency(singleTotal)} → Giá combo:{" "}
                          <span className="font-bold">
                            {formatCurrency(combo.comboPrice)}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComboSection;
