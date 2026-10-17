import { getProductById } from "@/core/apis/products";
import ProductDetailPage from "@/core/components/feature/products/detail/ProductDetailPage";
import { IMAGES } from "@/core/constants";
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
      title: "Sản phẩm không tồn tại - Lan Chuyên Hàng Sale",
      description:
        "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.",
    };
  }

  try {
    const product = await getProductById(Number(id));

    if (!product) {
      return {
        title: "Sản phẩm không tồn tại - Lan Chuyên Hàng Sale",
        description:
          "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.",
      };
    }
    return {
      title: `${product.productName} - Lan Chuyên Hàng Sale`,
      description:
        product.description ||
        `Mua ${product.productName} chính hãng với giá ưu đãi tại Lan Chuyên Hàng Sale. ${product.usageInstructions || "Sản phẩm chất lượng cao, an toàn cho sức khỏe."}`,
      keywords: [
        product.productName,
        "hàng sale",
        "giá rẻ",
        "chính hãng",
        "Lan chuyên hàng sale",
        ...(product.listTypes?.map((type: ListTypes) => type.typeName) || []),
      ],
      openGraph: {
        title: `${product.productName} - Lan Chuyên Hàng Sale`,
        description:
          product.description ||
          `Mua ${product.productName} chính hãng với giá ưu đãi tại Lan Chuyên Hàng Sale.`,
        url: `https://lanchuyenhangsale.com/products/${url}`,
        type: "website",
        images: [
          {
            url: product.listImages?.[0]?.link || IMAGES.DEMO_PRODUCTS.DEMO_1,
            width: 1200,
            height: 630,
            alt: product.productName,
          },
        ],
        siteName: "Lan Chuyên Hàng Sale",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.productName} - Lan Chuyên Hàng Sale`,
        description:
          product.description ||
          `Mua ${product.productName} chính hãng với giá ưu đãi.`,
        images: [product.listImages?.[0]?.link || IMAGES.DEMO_PRODUCTS.DEMO_1],
      },
      alternates: {
        canonical: `https://lanchuyenhangsale.com/products/${url}`,
      },
    };
  } catch (error) {
    return {
      title: "Lỗi tải sản phẩm - Lan Chuyên Hàng Sale",
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
