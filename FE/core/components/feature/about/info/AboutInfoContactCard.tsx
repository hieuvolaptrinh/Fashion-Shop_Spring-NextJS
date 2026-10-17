import { ABOUT_DATA } from "@/core/constants/about";
import { ArrowRight, Globe, MessageCircle, PhoneCall } from "lucide-react";

export const AboutInfoContactCard = () => {
  const { contactInfo } = ABOUT_DATA;

  return (
    <div className="group flex h-full flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl sm:p-8">
      <div>
        {/* Header thẻ */}
        <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Kênh Hỗ Trợ Trực Tiếp
          </h3>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Online hỗ trợ</span>
          </div>
        </div>

        {/* Danh sách nút liên hệ nhanh */}
        <div className="space-y-3.5">
          {/* Hotline Action Card */}
          <a
            href={`tel:${contactInfo.company.hotline.replace(/\./g, "")}`}
            className="group/item flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/[0.04] hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover/item:scale-105">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Hotline tư vấn nhanh
                </p>
                <p className="text-sm font-bold text-foreground transition-colors group-hover/item:text-primary">
                  {contactInfo.company.hotline}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary">
              <span>Gọi ngay</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/item:translate-x-0.5" />
            </div>
          </a>

          {/* Đặt hàng Action Card */}
          <a
            href={`tel:${contactInfo.company.orderPhone.replace(/\./g, "")}`}
            className="group/item flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-amber-500/[0.04] hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform duration-200 group-hover/item:scale-105">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Số điện thoại đặt hàng
                </p>
                <p className="text-sm font-bold text-foreground transition-colors group-hover/item:text-amber-600">
                  {contactInfo.company.orderPhone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
              <span>Gọi ngay</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/item:translate-x-0.5" />
            </div>
          </a>

          {/* Zalo Action Card */}
          <a
            href={`https://zalo.me/${contactInfo.company.zalo.replace(/\./g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/item flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-500/40 hover:bg-sky-500/[0.04] hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 transition-transform duration-200 group-hover/item:scale-105">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Chat Zalo chính thức
                </p>
                <p className="text-sm font-bold text-foreground transition-colors group-hover/item:text-sky-600">
                  {contactInfo.company.zalo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-sky-600">
              <span>Nhắn tin</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/item:translate-x-0.5" />
            </div>
          </a>
        </div>
      </div>

      {/* Chân thẻ */}
      <div className="mt-6 flex items-center gap-2 border-t border-border/50 pt-4 text-xs text-muted-foreground">
        <Globe className="h-4 w-4 text-primary" />
        <span>
          Website:{" "}
          <strong className="font-semibold text-foreground">
            {contactInfo.company.website}
          </strong>
        </span>
      </div>
    </div>
  );
};
