import {
  ContactChannels,
  ContactFaq,
  ContactForm,
  ContactHero,
  ContactInfo,
} from "@/core/components/feature/contact";
import { ScrollReveal } from "@/core/components/ui/scroll-reveal";
import { Metadata } from "next";
import { BRAND } from "@/core/constants";

export const metadata: Metadata = {
  title: `Liên Hệ - ${BRAND.name}`,
  description:
    `Liên hệ với ${BRAND.name} để được tư vấn chọn size và hỗ trợ nhanh chóng. Hotline: ${BRAND.hotlines.join(" - ")}. Chúng tôi luôn sẵn sàng phục vụ bạn 24/7.`,
  keywords: [
    "liên hệ",
    "hỗ trợ khách hàng",
    "tư vấn thời trang",
    "hotline",
    BRAND.name,
    "chăm sóc khách hàng",
  ],
  openGraph: {
    title: `Liên Hệ - ${BRAND.name}`,
    description:
      `Liên hệ với chúng tôi để được tư vấn và hỗ trợ về sản phẩm thời trang. Hotline: ${BRAND.primaryPhone}, hỗ trợ 24/7.`,
    url: `${BRAND.siteUrl}/contact`,
    type: "website",
  },
  alternates: {
    canonical: `${BRAND.siteUrl}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ContactHero />

      <ContactChannels />

      <section className="container mx-auto px-4 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" distance={24} duration={600}>
              <ContactForm />
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5">
            <ScrollReveal direction="up" distance={24} delay={150} duration={600}>
              <ContactInfo />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ContactFaq />
    </div>
  );
}
