import { Badge } from "@/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { CONTACT_DATA } from "@/core/constants/contact";
import {
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

export const ContactInfo = () => {
  const { storeInfo } = CONTACT_DATA;

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Main Store Information Card */}
      <Card className="border border-border/70 bg-card/70 shadow-sm backdrop-blur-sm">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground sm:text-2xl">
            {storeInfo.name}
          </CardTitle>
          <CardDescription className="text-xs italic text-muted-foreground sm:text-sm">
            "{storeInfo.slogan}"
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs sm:text-sm">
          <p className="leading-relaxed text-muted-foreground">
            {storeInfo.description}
          </p>

          <div className="space-y-3 pt-2">
            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-medium text-foreground">Hotline hỗ trợ:</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {storeInfo.hotlines.map((hotline, idx) => (
                    <a
                      key={idx}
                      href={`tel:${hotline.replace(/\./g, "")}`}
                      className="font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                    >
                      {hotline}
                      {idx < storeInfo.hotlines.length - 1 && " •"}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Zalo */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-medium text-foreground">Zalo tư vấn:</span>
                <a
                  href={`https://zalo.me/${storeInfo.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                >
                  {storeInfo.zalo}{" "}
                  <span className="font-normal text-muted-foreground">(Nhắn tin trực tiếp)</span>
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-medium text-foreground">Email liên hệ:</span>
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                >
                  {storeInfo.email}
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-medium text-foreground">Giờ hoạt động:</span>
                <p className="text-muted-foreground">{storeInfo.workingHours}</p>
                <span className="inline-block mt-0.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground border border-border/40">
                  {storeInfo.onlineStatus}
                </span>
              </div>
            </div>

            {/* Website & Fanpage */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-medium text-foreground">Kênh trực tuyến:</span>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{storeInfo.website}</span>
                  <span>•</span>
                  <span>{storeInfo.fanpage}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commitments & Categories Card */}
      <Card className="border border-border/70 bg-card/70 shadow-sm backdrop-blur-sm">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cam kết dịch vụ & Mua sắm
            </h4>
            <div className="space-y-2">
              {storeInfo.commitments.map((commitment, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{commitment}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Các ngành hàng nổi bật
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {storeInfo.productHighlights.map((item, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="rounded-md border border-border/50 bg-secondary/60 text-[11px] font-normal hover:bg-secondary"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
