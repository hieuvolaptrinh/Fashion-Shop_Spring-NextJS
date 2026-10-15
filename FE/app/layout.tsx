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
import { Merriweather, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/core/components/ui/sonner";
import { Suspense, type ReactNode } from "react";

// FONT CONFIGURATION: Cấu hình font chữ
// Google Fonts giúp cải thiện tốc độ tải và SEO
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Các độ đậm nhạt
  display: "swap", // Hiển thị font dự phòng trước, sau đó swap
  variable: "--font-primary", // CSS variable
});
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-secondary",
});

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
        {/* 
          PHẦN META TAGS TRONG <HEAD>
          Đây là các thẻ meta bổ sung, một số có thể trùng với metadata ở trên
          nhưng được viết trực tiếp để đảm bảo tương thích với mọi platform
        */}
        {/* META ROBOTS: Hướng dẫn bot tìm kiếm */}
        <meta name="robots" content="index, follow" />
        {/* OPEN GRAPH META TAGS: Cho Facebook, Zalo khi chia sẻ */}
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
        {/* FACEBOOK OPEN GRAPH TAGS: Cài đặt bổ sung cho Facebook */}
        <meta property="fb:app_id" content="your-facebook-app-id" />{" "}
        {/* ID ứng dụng Facebook */}
        <meta
          property="article:publisher"
          content="https://www.facebook.com/shopmonglan" // Link Facebook Page
        />
        {/* TWITTER CARD TAGS: Cho Twitter khi chia sẻ link */}
        <meta name="twitter:card" content="summary_large_image" />{" "}
        {/* Loại card hiển thị */}
        <meta name="twitter:title" content="Lan Chuyên Hàng Sale" />
        <meta
          name="twitter:description"
          content="Lan Chuyên Hàng Sale - 10+ năm kinh nghiệm cung cấp sản phẩm sale chính hãng: sức khỏe, làm đẹp, gia dụng với giá ưu đãi nhất."
        />
        <meta
          name="twitter:image"
          content="https://lanchuyenhangsale.com/banner2.png"
        />
        {/* CANONICAL URL: URL chính thức của trang (tránh trùng lặp nội dung) */}
        <link rel="canonical" href="https://lanchuyenhangsale.com" />
        {/* PERFORMANCE OPTIMIZATION: Tối ưu hóa tốc độ tải trang */}
        <link rel="dns-prefetch" href="//lanchuyenhangsale.com" />{" "}
        {/* Tra cứu DNS trước */}
        <link
          rel="preconnect" /* Kết nối trước với server */
          href="https://lanchuyenhangsale.com"
          crossOrigin=""
        />
        {/* BOT CRAWLING: Hướng dẫn các bot tìm kiếm khác */}
        <meta name="googlebot" content="index, follow" /> {/* Google Bot */}
        <meta name="bingbot" content="index, follow" /> {/* Bing Bot */}
        <meta name="facebookexternalhit" content="index, follow" />{" "}
        {/* Facebook Bot */}
        {/* STRUCTURED DATA: Dữ liệu có cấu trúc giúp Google hiểu rõ hơn về doanh nghiệp */}
        {/* Schema.org Organization: Thông tin tổ chức/công ty */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org", // Ngữ cảnh schema
              "@type": "Organization", // Loại: Tổ chức
              name: "Lan Chuyên Hàng Sale", // Tên công ty
              url: "https://lanchuyenhangsale.com", // Website chính
              logo: "https://lanchuyenhangsale.com/logo.jpg", // Logo công ty
              contactPoint: {
                // Thông tin liên hệ
                "@type": "ContactPoint",
                telephone: "+84-931-133-128", // Số điện thoại
                contactType: "customer service", // Loại liên hệ
                areaServed: "VN", // Khu vực phục vụ (Việt Nam)
                availableLanguage: "Vietnamese", // Ngôn ngữ hỗ trợ
              },
              sameAs: [
                // Các trang mạng xã hội
                "https://facebook.com/lanchuyenhangsale",
                "https://zalo.me/0931133128",
              ],
              address: {
                // Địa chỉ
                "@type": "PostalAddress",
                addressCountry: "VN",
              },
            }),
          }}
        />
        {/* Schema.org Website: Thông tin về website và chức năng tìm kiếm */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite", // Loại: Website
              name: "Lan Chuyên Hàng Sale",
              url: "https://lanchuyenhangsale.com",
              description:
                "Chuyên cung cấp sản phẩm sale, giá rẻ, uy tín, chất lượng cao. Hàng gia dụng, sức khỏe, làm đẹp với giá ưu đãi nhất.",
              potentialAction: {
                // Chức năng tìm kiếm
                "@type": "SearchAction", // Loại hành động: Tìm kiếm
                target: {
                  // URL đích khi tìm kiếm
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://lanchuyenhangsale.com/products?search={search_term_string}",
                },
                "query-input": "required name=search_term_string", // Tham số tìm kiếm
              },
            }),
          }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${merriweather.variable} font-primary min-h-screen`}
        cz-shortcut-listen="true"
      >
        {/* 
          SUSPENSE: Hiển thị loading trong khi chờ component tải
          Giúp cải thiện trải nghiệm người dùng và Core Web Vitals (SEO ranking factor)
        */}
        <Suspense fallback={<p>Loading...</p>}>
          {children} {/* Nội dung các trang con */}
          {/* TOASTER: Thông báo cho người dùng */}
          <Toaster
            position="bottom-right" // Vị trí hiển thị
            richColors // Màu sắc đa dạng
            closeButton // Nút đóng
            expand={true} // Mở rộng
            visibleToasts={5} // Số lượng toast hiển thị cùng lúc
          />
        </Suspense>
      </body>
    </html>
  );
}
