import { Button } from "@/core/components/ui/button";
import { ScrollReveal } from "@/core/components/ui/scroll-reveal";
import { IMAGES } from "@/core/constants/images";
import { ROUTES } from "@/core/constants/routes";
import { MessageCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ABOUT_DATA } from "@/core/constants/about";

export const AboutCta = () => {
  const { cta } = ABOUT_DATA;

  return (
    <section className="py-8 sm:py-12">
      <ScrollReveal direction="up" distance={24} duration={700}>
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-b from-primary/[0.08] via-card to-card p-8 text-center shadow-xl shadow-primary/5 sm:p-12 md:p-16">
        {/* Đốm sáng Ambient Glow mờ ảo tạo chiều sâu */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
        />

        <div className="relative z-10">
          {/* Logo shop trong khung tròn */}
          <div className="relative mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full transition-transform duration-300 hover:scale-105 sm:h-24 sm:w-24 md:h-28 md:w-28">
            <Image
              src={IMAGES.LOGO}
              alt="Logo Lan Chuyên Hàng Sale"
              fill
              sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
              className="object-cover"
              priority
            />
          </div>

          {/* Tiêu đề kêu gọi */}
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {cta.title}
          </h2>

          {/* Mô tả */}
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
            {cta.description}
          </p>

          {/* Cặp nút hành động cao cấp */}
          <div className="flex flex-col justify-center gap-3.5 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="group h-12 rounded-2xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl sm:h-13 sm:text-base"
              asChild
            >
              <Link href={ROUTES.USER.PRODUCTS}>
                <ShoppingBag className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                <span>{cta.primaryButton}</span>
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="group h-12 rounded-2xl border-border/80 bg-card/80 px-8 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted sm:h-13 sm:text-base"
              asChild
            >
              <Link href={ROUTES.USER.CONTACT}>
                <MessageCircle className="mr-2 h-4 w-4 text-primary transition-transform duration-200 group-hover:scale-110" />
                <span>{cta.secondaryButton}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  </section>
  );
};
