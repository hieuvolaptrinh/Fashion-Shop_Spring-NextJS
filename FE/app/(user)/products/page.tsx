import ProductsPage from "@/core/components/feature/products/ProductsPage";
import { IMAGES, BRAND } from "@/core/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản Phẩm",
  description:
    `Khám phá bộ sưu tập thời trang nam nữ phong cách và hiện đại tại ${BRAND.name}. Chất lượng chọn lọc, cập nhật xu hướng mới nhất.`,
  keywords: [
    "thời trang nam",
    "thời trang nữ",
    "quần áo phong cách",
    "váy đầm",
    "phụ kiện thời trang",
    BRAND.name,
  ],
  openGraph: {
    title: `Sản Phẩm Thời Trang - ${BRAND.name}`,
    description:
      `Mua sắm sản phẩm thời trang cao cấp với giá ưu đãi tại ${BRAND.name}. Đa dạng danh mục, cam kết chất lượng.`,
    url: `${BRAND.siteUrl}/products`,
    type: "website",
    images: [
      {
        url: IMAGES.DEMO_PRODUCTS.DEMO_1,
        width: 1200,
        height: 630,
        alt: `Thời trang ${BRAND.name}`,
      },
    ],
  },
  alternates: {
    canonical: `${BRAND.siteUrl}/products`,
  },
};

export default function Products() {
  return <ProductsPage />;
}
