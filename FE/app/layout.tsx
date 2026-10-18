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

export const metadata: Metadata = {
  // TITLE: Tiêu đề trang web - quan trọng nhất cho SEO
  title: {
    default: "Lan Chuyên Hàng Sale", // Tiêu đề mặc định cho trang chủ
    template: "%s | Lan Chuyên Hàng Sale", // Template cho các trang con (ví dụ: "Sản phẩm | Lan Chuyên Hàng Sale")
  },
  // DESCRIPTION: Mô tả ngắn gọn về website (hiển thị trong kết quả tìm kiếm Google)
  // Nên dài 150-160 ký tự, chứa từ khóa chính
  description:
    "Lan Chuyên Hàng Sale – Cửa hàng uy tín chuyên cung cấp sản phẩm sale chính hãng: sức khỏe, thực phẩm chức năng, mỹ phẩm làm đẹp, hàng gia dụng với giá ưu đãi nhất. 10+ năm kinh nghiệm, 50,000+ khách hàng tin tưởng. Giao hàng nhanh, hỗ trợ 24/7.",

  // URL gốc của website - giúp Next.js tạo URL tuyệt đối cho các meta tag
  metadataBase: new URL("https://lanchuyenhangsale.com"),

  // Tên ứng dụng
  applicationName: "Lan Chuyên Hàng Sale",

  // Framework được sử dụng (Next.js)
  generator: "Next.js",

  // Chính sách referrer - bảo mật khi chuyển hướng
  referrer: "origin-when-cross-origin",
  // KEYWORDS: Từ khóa giúp Google hiểu nội dung website
  // Chọn từ khóa liên quan đến sản phẩm và dịch vụ của bạn
  keywords: [
    "hàng sale", // Từ khóa chính
    "hàng giá rẻ", // Từ khóa phụ
    "sản phẩm sức khỏe", // Danh mục sản phẩm
    "thực phẩm chức năng",
    "mỹ phẩm làm đẹp",
    "hàng sale chính hãng",
    "Lan chuyên hàng sale", // Tên thương hiệu
    "collagen", // Sản phẩm cụ thể
    "vitamin",
    "giảm cân",
    "trẻ hóa da",
    "hàng gia dụng",
    "mua sắm online", // Hành vi mua sắm
    "giao hàng nhanh", // Dịch vụ
    "COD", // Phương thức thanh toán
    "freeship", // Ưu đãi
    "sản phẩm chất lượng cao",
    "uy tín", // Tính chất thương hiệu
    "an toàn",
    "hàng sale chính hãng",
    "giá ưu đãi", // Ưu điểm cạnh tranh
    "khuyến mãi",
    "giảm giá",
    "mua sắm tiết kiệm",
    "sản phẩm hot", // Trending
  ],
  // THÔNG TIN TÁC GIỢ: Giúp Google hiểu ai là chủ sở hữu website
  authors: [
    { name: "Lan Chuyên Hàng Sale", url: "https://lanchuyenhangsale.com" },
  ],
  creator: "Lan Chuyên Hàng Sale Team", // Người tạo nội dung
  publisher: "Lan Chuyên Hàng Sale", // Nhà xuất bản

  // OPEN GRAPH: Meta tags cho Facebook, Zalo khi chia sẻ link
  openGraph: {
    title: "Lan Chuyên Hàng Sale", // Tiêu đề khi chia sẻ
    description:
      "Lan Chuyên Hàng Sale - 10+ năm kinh nghiệm cung cấp sản phẩm sale chính hãng: sức khỏe, làm đẹp, gia dụng với giá ưu đãi nhất. 50,000+ khách hàng hài lòng, cam kết chất lượng 100%.",
    url: "https://lanchuyenhangsale.com", // URL trang web
    siteName: "Lan Chuyên Hàng Sale", // Tên website
    images: [
      // Hình ảnh hiển thị khi chia sẻ (tỷ lệ 1200x630 px là tối ưu)
      {
        url: "https://lanchuyenhangsale.com/banner2.png",
        width: 1200,
        height: 630,
        alt: "Lan Chuyên Hàng Sale - Sản phẩm chính hãng cho sức khỏe & sắc đẹp",
      },
    ],
    locale: "vi_VN", // Ngôn ngữ (Tiếng Việt)
    type: "website", // Loại nội dung
  },
  // ROBOTS: Hướng dẫn cho các bot tìm kiếm (Google, Bing, etc.)
  robots: {
    index: true, // Cho phép lập chỉ mục (hiển thị trong kết quả tìm kiếm)
    follow: true, // Cho phép theo dõi các link trên trang
    nocache: false, // Cho phép cache trang
    googleBot: {
      // Cài đặt riêng cho Google Bot
      index: true,
      follow: true,
      "max-video-preview": -1, // Cho phép xem trước video không giới hạn
      "max-image-preview": "large", // Cho phép xem trước ảnh kích thước lớn
      "max-snippet": -1, // Cho phép đoạn trích không giới hạn
    },
  },

  // CATEGORY: Danh mục website
  category: "health and beauty",

  // CANONICAL URL: URL chính thức (tránh duplicate content)
  alternates: {
    canonical: "https://lanchuyenhangsale.com",
  },
  // ICONS: Các icon hiển thị trên trình duyệt và thiết bị
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32" }, // Icon nhỏ trên tab trình duyệt
      { url: "/logo.jpg", sizes: "192x192", type: "image/jpeg" }, // Icon lớn hơn
    ],
    shortcut: "/favicon.ico", // Icon shortcut
    apple: "/logo.jpg", // Icon cho thiết bị Apple (iPhone, iPad)
  },

  // VERIFICATION: Mã xác thực với Google Search Console
  verification: {
    google: "your-google-verification-code", // Thay bằng mã thực tế từ Google Search Console
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
        <meta property="og:title" content="Lan Chuyên Hàng Sale" />
        <meta
          property="og:description"
          content="Lan Chuyên Hàng Sale - 10+ năm kinh nghiệm cung cấp sản phẩm sale chính hãng: sức khỏe, làm đẹp, gia dụng với giá ưu đãi nhất. 50,000+ khách hàng hài lòng, cam kết chất lượng 100%."
        />
        <meta property="og:url" content="https://lanchuyenhangsale.com" />
        <meta property="og:site_name" content="Lan Chuyên Hàng Sale" />
        <meta
          property="og:image"
          content="https://lanchuyenhangsale.com/banner2.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Lan Chuyên Hàng Sale - Sản phẩm chính hãng cho sức khỏe & sắc đẹp"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        <meta property="fb:app_id" content="your-facebook-app-id" />
        <meta
          property="article:publisher"
          content="https://www.facebook.com/shopmonglan"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lan Chuyên Hàng Sale" />
        <meta
          name="twitter:description"
          content="Lan Chuyên Hàng Sale - 10+ năm kinh nghiệm cung cấp sản phẩm sale chính hãng: sức khỏe, làm đẹp, gia dụng với giá ưu đãi nhất."
        />
        <meta
          name="twitter:image"
          content="https://lanchuyenhangsale.com/banner2.png"
        />
        <link rel="canonical" href="https://lanchuyenhangsale.com" />
        <link rel="dns-prefetch" href="//lanchuyenhangsale.com" />
        <link
          rel="preconnect"
          href="https://lanchuyenhangsale.com"
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
              name: "Lan Chuyên Hàng Sale",
              url: "https://lanchuyenhangsale.com",
              logo: "https://lanchuyenhangsale.com/logo.jpg",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+84-931-133-128",
                contactType: "customer service",
                areaServed: "VN",
                availableLanguage: "Vietnamese",
              },
              sameAs: [
                "https://facebook.com/lanchuyenhangsale",
                "https://zalo.me/0931133128",
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
              name: "Lan Chuyên Hàng Sale",
              url: "https://lanchuyenhangsale.com",
              description:
                "Chuyên cung cấp sản phẩm sale, giá rẻ, uy tín, chất lượng cao. Hàng gia dụng, sức khỏe, làm đẹp với giá ưu đãi nhất.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://lanchuyenhangsale.com/products?search={search_term_string}",
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
