import { Badge } from "@/core/components/ui/badge";
import { ABOUT_DATA } from "@/core/constants/about";
import { Clock, ShieldCheck, Truck } from "lucide-react";

export const AboutInfoPolicyCard = () => {
  const { contactInfo } = ABOUT_DATA;

  return (
    <div className="group flex h-full flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl sm:p-8">
      <div>
        <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Chính Sách & Thời Gian
          </h3>
        </div>

        <div className="space-y-3.5">
          {/* Giờ bán hàng */}
          <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-muted/15 p-3.5 transition-all duration-200 hover:border-border hover:bg-muted/25">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="text-xs font-bold text-foreground">Giờ phục vụ tại shop</p>
                <Badge variant="outline" className="border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {contactInfo.policies.onlineHours}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {contactInfo.policies.businessHours}
              </p>
            </div>
          </div>

          {/* Đổi trả */}
          <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-muted/15 p-3.5 transition-all duration-200 hover:border-border hover:bg-muted/25">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="text-xs font-bold text-foreground">Chính sách đổi trả</p>
                <Badge variant="outline" className="border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  Miễn phí
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {contactInfo.policies.returns}
              </p>
            </div>
          </div>

          {/* Giao hàng */}
          <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-muted/15 p-3.5 transition-all duration-200 hover:border-border hover:bg-muted/25">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
              <Truck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="text-xs font-bold text-foreground">Vận chuyển toàn quốc</p>
                <Badge variant="outline" className="border-sky-500/25 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-600">
                  Toàn quốc
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {contactInfo.policies.shipping} • {contactInfo.policies.freeship}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border/50 pt-4 text-xs text-muted-foreground">
        <span>An tâm mua sắm với chính sách rõ ràng, minh bạch</span>
      </div>
    </div>
  );
};
