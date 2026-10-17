import { ABOUT_DATA } from "@/core/constants/about";
import { Banknote, CheckCircle2, CreditCard, Smartphone } from "lucide-react";

export const AboutInfoPaymentCard = () => {
  const { contactInfo } = ABOUT_DATA;

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "cod":
        return <Banknote className="h-3.5 w-3.5 text-emerald-600" />;
      case "chuyển khoản":
        return <CreditCard className="h-3.5 w-3.5 text-sky-600" />;
      case "ví điện tử":
        return <Smartphone className="h-3.5 w-3.5 text-purple-600" />;
      default:
        return <CreditCard className="h-3.5 w-3.5 text-primary" />;
    }
  };

  return (
    <div className="group flex h-full flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl sm:p-8">
      <div>
        <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Thanh Toán & Cam Kết Vàng
          </h3>
        </div>

        <div className="space-y-4">
          {/* Phương thức thanh toán */}
          <div>
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Phương thức thanh toán linh hoạt
            </p>
            <div className="flex flex-wrap gap-2">
              {contactInfo.payments.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  {getPaymentIcon(method)}
                  <span>{method}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2 Cam kết bất biến của shop */}
          <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-4 transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.06] sm:p-5">
            <div className="mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                2 Cam kết bất biến của shop
              </p>
            </div>
            <div className="space-y-2.5">
              {contactInfo.commitments.map((commitment, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {commitment}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border/50 pt-4 text-xs text-muted-foreground">
        <span>Luôn đặt sự hài lòng của khách hàng làm kim chỉ nam</span>
      </div>
    </div>
  );
};
