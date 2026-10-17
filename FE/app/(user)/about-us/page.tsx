import {
  AboutBento,
  AboutCta,
  AboutHero,
  AboutInfo,
  AboutTeam,
} from "@/core/components/feature/about";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về Chúng Tôi - Lan Chuyên Hàng Sale Là Ai?",
  description:
    "Khám phá câu chuyện và sứ mệnh của Lan Chuyên Hàng Sale - 10+ năm kinh nghiệm cung cấp sản phẩm sale chính hãng, chất lượng cao với giá ưu đãi nhất. 50,000+ khách hàng tin tưởng.",
  keywords: [
    "về chúng tôi",
    "Lan chuyên hàng sale",
    "câu chuyện thương hiệu",
    "kinh nghiệm",
    "uy tín",
    "chất lượng",
    "sứ mệnh",
  ],
  openGraph: {
    title: "Về Chúng Tôi - Lan Chuyên Hàng Sale",
    description:
      "10+ năm kinh nghiệm trong lĩnh vực cung cấp sản phẩm sale chính hãng. 50,000+ khách hàng hài lòng, cam kết chất lượng 100%.",
    url: "https://lanchuyenhangsale.com/about-us",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Lan Chuyên Hàng Sale - Về chúng tôi",
      },
    ],
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com/about-us",
  },
};

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Asymmetric Split Hero lồng ghép Brand Logo & 4 Floating Stat Cards */}
      <AboutHero />

      {/* 2. Main Content Sections */}
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16 space-y-12 sm:space-y-16">
        {/* 2.1. Bento Grid 3 cột bất đối xứng (Câu chuyện 10 năm & 4 Giá trị cốt lõi) */}
        <AboutBento />

        {/* 2.2. Đội ngũ nhân sự dạng Profile Cards tương tác */}
        <AboutTeam />

        {/* 2.3. Thông tin liên hệ & Chính sách (Action Cards gọi Hotline/Zalo trực tiếp) */}
        <AboutInfo />

        {/* 2.4. Kêu gọi hành động cuối trang */}
        <AboutCta />
      </main>
    </div>
  );
};

export default AboutUsPage;
