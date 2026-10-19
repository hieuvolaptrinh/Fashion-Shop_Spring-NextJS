import HomePage from "@/core/components/feature/home/HomePage";
import { IMAGES, BRAND } from "@/core/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang Chủ",
  description:
    `Chào mừng đến với ${BRAND.name} - ${BRAND.slogan}. Khám phá bộ sưu tập thời trang nam nữ phong cách, bắt kịp xu hướng và chất lượng cao.`,
  keywords: [
    "thời trang",
    "thời trang nam",
    "thời trang nữ",
    BRAND.name,
    "quần áo phong cách",
    "mua sắm online",
  ],
  openGraph: {
    title: `${BRAND.name} - ${BRAND.slogan}`,
    description: BRAND.description,
    url: BRAND.siteUrl,
    type: "website",
    images: [
      {
        url: IMAGES.BANNERS.BANNER_2,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - ${BRAND.slogan}`,
      },
    ],
    siteName: BRAND.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} - ${BRAND.slogan}`,
    description: BRAND.description,
    images: [IMAGES.BANNERS.BANNER_2],
  },
  alternates: {
    canonical: BRAND.siteUrl,
  },
};
export default function Home() {
  return <HomePage />;
}
