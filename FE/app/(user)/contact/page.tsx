import {
  ContactChannels,
  ContactCta,
  ContactFaq,
  ContactForm,
  ContactHero,
  ContactInfo,
} from "@/core/components/feature/contact";
import { ScrollReveal } from "@/core/components/ui/scroll-reveal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên Hệ - Lan Chuyên Hàng Sale",
  description:
    "Liên hệ với Lan Chuyên Hàng Sale để được tư vấn và hỗ trợ nhanh chóng. Hotline: 093.1133.128 - Zalo: 0819.314.893. Chúng tôi luôn sẵn sàng phục vụ bạn 24/7.",
  keywords: [
    "liên hệ",
    "hỗ trợ khách hàng",
    "tư vấn sản phẩm",
    "hotline",
    "Lan chuyên hàng sale",
    "chăm sóc khách hàng",
  ],
  openGraph: {
    title: "Liên Hệ - Lan Chuyên Hàng Sale",
    description:
      "Liên hệ với chúng tôi để được tư vấn và hỗ trợ về sản phẩm sale chất lượng. Hotline: 093.1133.128, hỗ trợ 24/7.",
    url: "https://lanchuyenhangsale.com/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Hero Header */}
      <ContactHero />

      {/* 2. Bento Channels Quick Contact */}
      <ContactChannels />

      {/* 3. Main Split Section: Form & Store Information */}
      <section className="container mx-auto px-4 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Contact Interactive Form */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" distance={24} duration={600}>
              <ContactForm />
            </ScrollReveal>
          </div>

          {/* Store Info & Commitments */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="up" distance={24} delay={150} duration={600}>
              <ContactInfo />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions (Accordion) */}
      <ContactFaq />

      {/* 5. Quick Support Call to Action */}
      <ContactCta />
    </div>
  );
}
