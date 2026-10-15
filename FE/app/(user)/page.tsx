import HomePage from "core/components/feature/home/homePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang Chủ",
  description:
    "Chào mừng đến với Lan Chuyên Hàng Sale - nơi cung cấp sản phẩm sức khỏe, làm đẹp, gia dụng chính hãng với giá ưu đãi nhất. Hàng sale chất lượng cao, giao hàng nhanh chóng.",
  keywords: [
    "hàng sale",
    "sản phẩm giá rẻ",
    "hàng chính hãng",
    "sức khỏe",
    "làm đẹp",
    "gia dụng",
    "Lan chuyên hàng sale",
    "mua sắm online",
  ],
  openGraph: {
    title: "Lan Chuyên Hàng Sale - Hàng Sale Chất Lượng Giá Rẻ",
    description:
      "Chuyên cung cấp sản phẩm sale chính hãng: sức khỏe, làm đẹp, gia dụng với giá ưu đãi nhất. Cam kết chất lượng, giao hàng nhanh.",
    url: "https://lanchuyenhangsale.com",
    type: "website",
    images: [
      {
        url: "/banner2.png",
        width: 1200,
        height: 630,
        alt: "Lan Chuyên Hàng Sale - Sản phẩm chính hãng giá rẻ",
      },
    ],
    siteName: "Lan Chuyên Hàng Sale",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lan Chuyên Hàng Sale - Hàng Sale Chất Lượng Giá Rẻ",
    description:
      "Chuyên cung cấp sản phẩm sale chính hãng với giá ưu đãi nhất. Sức khỏe, làm đẹp, gia dụng chất lượng cao.",
    images: ["/banner2.png"],
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com",
  },
};
export default function Home() {
  return <HomePage />;
}
