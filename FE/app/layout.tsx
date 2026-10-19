/*
  FILE LAYOUT.TSX - ROOT LAYOUT
  ===============================
  
  Đây là file quan trọng nhất cho SEO trong Next.js App Router.
  File này chứa tất cả thông tin SEO cơ bản cho toàn bộ website.

  🎯 MỤC ĐÍCH SEO:
  1. Giúp Google hiểu nội dung website
  2. Cải thiện thứ hạng tìm kiếm 
  3. Tối ưu hiển thị khi chia sẻ trên mạng xã hội
  4. Tăng tốc độ tải trang
  5. Cung cấp dữ liệu có cấu trúc cho search engines

  📊 CÁC THÀNH PHẦN CHÍNH:
  - Metadata: Title, description, keywords
  - Open Graph: Cho Facebook, Zalo
  - Twitter Cards: Cho Twitter  
  - Schema.org: Dữ liệu có cấu trúc
  - Performance: Tối ưu tốc độ
*/

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/core/components/ui/sonner";
import { Suspense, type ReactNode } from "react";
import { BRAND } from "@/core/constants";

export const metadata: Metadata = {
  // TITLE: Tiêu đề trang web - quan trọng nhất cho SEO
  title: {
    default: `${BRAND.name} - ${BRAND.slogan}`,
    template: `%s | ${BRAND.name}`,
  },
  // DESCRIPTION: Mô tả ngắn gọn về website
  description: BRAND.description,

  // URL gốc của website
  metadataBase: new URL(BRAND.siteUrl),

  // Tên ứng dụng
  applicationName: BRAND.name,

  // Framework được sử dụng
  generator: "Next.js",

  // Chính sách referrer
  referrer: "origin-when-cross-origin",
  // KEYWORDS: Từ khóa thời trang
  keywords: [
    "thời trang",
    "thời trang nam",
    "thời trang nữ",
    "quần áo phong cách",
    "váy đầm",
    "phụ kiện thời trang",
    BRAND.name,
    "HALOKAKI fashion",
    "shop thời trang",
    "mua sắm online",
    "giao hàng nhanh",
    "COD",
    "freeship",
    "chất lượng cao",
    "uy tín",
  ],
  // THÔNG TIN TÁC GIẢ
  authors: [
    { name: BRAND.name, url: BRAND.siteUrl },
  ],
  creator: `${BRAND.name} Team`,
  publisher: BRAND.name,

  // OPEN GRAPH: Meta tags cho Facebook, Zalo khi chia sẻ link
  openGraph: {
    title: `${BRAND.name} - ${BRAND.slogan}`,
    description: BRAND.description,
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    images: [
      {
        url: `${BRAND.siteUrl}/banner2.png`,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - ${BRAND.slogan}`,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  // ROBOTS
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // CATEGORY
  category: "fashion and apparel",

  // CANONICAL URL
  alternates: {
    canonical: BRAND.siteUrl,
  },
  // ICONS: Trỏ favicon và logo-1.jpg
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32" },
      { url: "/logo-1.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo-1.jpg",
  },

  // VERIFICATION
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi">
      {/* Khai báo ngôn ngữ tiếng Việt cho website */}
      <head>
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${BRAND.name} - ${BRAND.slogan}`} />
        <meta
          property="og:description"
          content={BRAND.description}
        />
        <meta property="og:url" content={BRAND.siteUrl} />
        <meta property="og:site_name" content={BRAND.name} />
        <meta
          property="og:image"
          content={`${BRAND.siteUrl}/banner2.png`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={`${BRAND.name} - ${BRAND.slogan}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={BRAND.name} />
        <meta
          name="twitter:description"
          content={BRAND.description}
        />
        <meta
          name="twitter:image"
          content={`${BRAND.siteUrl}/banner2.png`}
        />
        <link rel="canonical" href={BRAND.siteUrl} />
        <link rel="dns-prefetch" href={`//${BRAND.domain}`} />
        <link
          rel="preconnect"
          href={BRAND.siteUrl}
          crossOrigin=""
        />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="facebookexternalhit" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: BRAND.name,
              url: BRAND.siteUrl,
              logo: `${BRAND.siteUrl}/logo-1.jpg`,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: BRAND.primaryPhone,
                contactType: "customer service",
                areaServed: "VN",
                availableLanguage: "Vietnamese",
              },
              sameAs: [
                `https://zalo.me/${BRAND.zalo.replace(/\./g, "")}`,
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: BRAND.name,
              url: BRAND.siteUrl,
              description: BRAND.description,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    `${BRAND.siteUrl}/products?search={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className="font-primary min-h-screen"
        cz-shortcut-listen="true"
      >
        <Suspense fallback={<p>Loading...</p>}>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            expand={true}
            visibleToasts={5}
          />
        </Suspense>
      </body>
    </html>
  );
}
