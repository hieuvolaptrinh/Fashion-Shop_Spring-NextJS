import { Button } from "@/core/components/ui/button";
import { IMAGES } from "@/core/constants/images";
import {
  Award,
  CheckCircle2,
  Headphones,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import { ABOUT_DATA } from "@/core/constants/about";

export const AboutHero = () => {
  const { hero } = ABOUT_DATA;

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/40 via-background to-background py-12 sm:py-16 md:py-20">
      {/* Ambient Gradient Glow Orbs (Đốm sáng nền mềm mại tạo chiều sâu) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-primary/25 via-sky-400/20 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tl from-blue-600/20 via-primary/20 to-transparent blur-3xl"
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Cột trái: Thông điệp thương hiệu & Actions */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
              Uy Tín & Chất Lượng <br />
              <span className="mt-2 inline-block pt-1 pb-2 bg-gradient-to-r from-primary via-sky-500 to-blue-600 bg-clip-text text-transparent dark:from-primary dark:via-sky-400 dark:to-blue-400">
                Đồng Hành Cùng Bạn
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              {hero.description}
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <Button
                className="h-11 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 hover:brightness-105 hover:shadow-lg hover:shadow-primary/35 active:scale-[0.98] sm:text-base"
                asChild
              >
                <a href={hero.hotline.href}>
                  <Phone className="mr-2 h-4 w-4" />
                  {hero.hotline.label}
                </a>
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-xl border-border/80 bg-card px-6 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted sm:text-base"
                asChild
              >
                <a
                  href={hero.zalo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-primary" />
                  {hero.zalo.label}
                </a>
              </Button>
            </div>

            {/* Mini Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:gap-6 sm:text-sm lg:justify-start">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Ship COD toàn quốc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>7 ngày đổi trả miễn phí</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Hàng kiểm tra kỹ lưỡng</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Card nhận diện thương hiệu lồng Floating Stats Cards */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            {/* Khung trung tâm với Logo */}
            <div className="relative flex aspect-square w-full items-center justify-center rounded-3xl border border-border/60 bg-card p-6 shadow-xl shadow-primary/5 sm:p-10">
              <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-3xl border-2 border-primary/20 bg-muted/20 p-3 shadow-inner transition-transform duration-300 hover:scale-105 sm:h-56 sm:w-56 md:h-60 md:w-60">
                <Image
                  src={IMAGES.LOGO}
                  alt="Lan Chuyên Hàng Sale"
                  width={260}
                  height={260}
                  className="rounded-2xl object-contain"
                  priority
                />
              </div>

              {/* Floating Card 1: Phía trên bên trái - 10+ Năm kinh nghiệm */}
              <div className="animate-float-slow absolute -left-2 top-2 flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:-left-7 sm:top-5 sm:p-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 sm:h-10 sm:w-10">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground sm:text-base">
                    10+ Năm
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Kinh nghiệm uy tín
                  </p>
                </div>
              </div>

              {/* Floating Card 2: Lệch phải giữa - 50,000+ Khách hàng */}
              <div className="animate-float-delayed absolute -right-3 top-10 flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:-right-8 sm:top-12 sm:p-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground sm:text-base">
                    50,000+
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Khách hài lòng
                  </p>
                </div>
              </div>

              {/* Floating Card 3: Lệch trái dưới - 100% Chất lượng */}
              <div className="animate-float-subtle absolute -left-3 bottom-10 flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:-left-6 sm:bottom-12 sm:p-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 sm:h-10 sm:w-10">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground sm:text-base">
                    100%
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Hàng chất lượng
                  </p>
                </div>
              </div>

              {/* Floating Card 4: Sát chân bên phải - 24/7 Tư vấn */}
              <div className="animate-float-reverse absolute right-1 -bottom-2 flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:right-6 sm:-bottom-3 sm:p-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 sm:h-10 sm:w-10">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground sm:text-base">
                    24/7
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Tư vấn tận tâm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
