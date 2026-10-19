import {
  AboutBento,
  AboutHero,
  AboutInfo,
  AboutTeam,
} from "@/core/components/feature/about";
import { Metadata } from "next";
import { BRAND } from "@/core/constants";

export const metadata: Metadata = {
  title: `Về Chúng Tôi - ${BRAND.name}`,
  description:
    `Khám phá câu chuyện và sứ mệnh của ${BRAND.name} - ${BRAND.slogan}. Hơn 10 năm phát triển mang đến các sản phẩm thời trang cao cấp, phong cách và chất lượng.`,
  keywords: [
    "về chúng tôi",
    BRAND.name,
    "câu chuyện thương hiệu",
    "thời trang phong cách",
    "uy tín",
    "chất lượng",
  ],
  openGraph: {
    title: `Về Chúng Tôi - ${BRAND.name}`,
    description:
      `Khám phá thương hiệu thời trang ${BRAND.name} - Cam kết chất lượng và phong cách thời thượng.`,
    url: `${BRAND.siteUrl}/about-us`,
    type: "website",
    images: [
      {
        url: "/logo-1.jpg",
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - Về chúng tôi`,
      },
    ],
  },
  alternates: {
    canonical: `${BRAND.siteUrl}/about-us`,
  },
};

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AboutHero />

      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16 space-y-12 sm:space-y-16">
        <AboutBento />

        <AboutTeam />

        <AboutInfo />
      </main>
    </div>
  );
};

export default AboutUsPage;
