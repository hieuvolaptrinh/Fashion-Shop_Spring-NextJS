import ProductsPage from "@/core/components/feature/products/productsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản Phẩm",
  description:
    "Khám phá hàng ngàn sản phẩm sale chất lượng cao: sức khỏe, làm đẹp, gia dụng với giá ưu đãi tại Lan Chuyên Hàng Sale. Hàng chính hãng, giao hàng nhanh.",
  keywords: [
    "sản phẩm sale",
    "hàng giá rẻ",
    "sức khỏe",
    "làm đẹp",
    "gia dụng",
    "collagen",
    "vitamin",
    "mỹ phẩm",
    "thực phẩm chức năng",
  ],
  openGraph: {
    title: "Sản Phẩm Sale Chính Hãng - Lan Chuyên Hàng Sale",
    description:
      "Mua sắm sản phẩm sale chất lượng cao với giá ưu đãi. Đa dạng danh mục: sức khỏe, làm đẹp, gia dụng. Hàng chính hãng, cam kết chất lượng.",
    url: "https://lanchuyenhangsale.com/products",
    type: "website",
    images: [
      {
        url: "/productDemo1.jpg",
        width: 1200,
        height: 630,
        alt: "Sản phẩm sale chất lượng cao",
      },
    ],
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com/products",
  },
};

export default function Products() {
  return <ProductsPage />;
}
