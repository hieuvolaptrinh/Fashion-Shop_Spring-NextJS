import { getProductById } from "@/core/apis/products";
import ProductDetailPage from "@/core/components/feature/products/detail/ProductDetailPage";
import { IMAGES, BRAND } from "@/core/constants";
import { convertToSlugWithId } from "@/core/lib/convert";
import type { ListTypes } from "@/core/lib/type";
import { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const url = (await params).id;
  const id = convertToSlugWithId(url);

  if (!id) {
    return {
      title: `Sản phẩm không tồn tại - ${BRAND.name}`,
      description:
        "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.",
    };
  }

  try {
    const product = await getProductById(Number(id));

    if (!product) {
      return {
        title: `Sản phẩm không tồn tại - ${BRAND.name}`,
        description:
          "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.",
      };
    }
    return {
      title: `${product.productName} - ${BRAND.name}`,
      description:
        product.description ||
        `Mua ${product.productName} thời trang cao cấp tại ${BRAND.name}. ${product.usageInstructions || "Sản phẩm thiết kế đẹp, chất liệu cao cấp."}`,
      keywords: [
        product.productName,
        "thời trang",
        BRAND.name,
        ...(product.listTypes?.map((type: ListTypes) => type.typeName) || []),
      ],
      openGraph: {
        title: `${product.productName} - ${BRAND.name}`,
        description:
          product.description ||
          `Mua ${product.productName} thời trang cao cấp tại ${BRAND.name}.`,
        url: `${BRAND.siteUrl}/products/${url}`,
        type: "website",
        images: [
          {
            url: product.listImages?.[0]?.link || IMAGES.DEMO_PRODUCTS.DEMO_1,
            width: 1200,
            height: 630,
            alt: product.productName,
          },
        ],
        siteName: BRAND.name,
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.productName} - ${BRAND.name}`,
        description:
          product.description ||
          `Mua ${product.productName} thời trang chất lượng tại ${BRAND.name}.`,
        images: [product.listImages?.[0]?.link || IMAGES.DEMO_PRODUCTS.DEMO_1],
      },
      alternates: {
        canonical: `${BRAND.siteUrl}/products/${url}`,
      },
    };
  } catch (error) {
    return {
      title: `Lỗi tải sản phẩm - ${BRAND.name}`,
      description:
        "Có lỗi xảy ra khi tải thông tin sản phẩm. Vui lòng thử lại sau.",
    };
  }
}

export default async function ProductDetailPageWrapper({ params }: Props) {
  const url = (await params).id;
  const id = convertToSlugWithId(url);

  if (!id) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h2 className="text-xl font-bold text-foreground">Sản phẩm không tồn tại</h2>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-24 text-center text-sm text-muted-foreground">
          Đang tải thông tin sản phẩm...
        </div>
      }
    >
      <ProductDetailPage productId={id} />
    </Suspense>
  );
}
