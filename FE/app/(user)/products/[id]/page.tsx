import { getProductById } from "@/core/apis/products";
import { convertToSlugWithId } from "@/core/lib/convert";
import { Metadata } from "next";
import { Suspense } from "react";
import ProductDetail from "./_components/productDetailPage";

type Props = {
  params: Promise<{ id: string }>;
  // SEARCH PARAMS
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
    // fetch
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
        ...(product.listTypes?.map((type: any) => type.typeName) || []),
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
            url: product.listImages?.[0]?.link || "/productDemo1.jpg",
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
        images: [product.listImages?.[0]?.link || "/productDemo1.jpg"],
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

// [slug]: dynamic route
const ProductDetailPage = async ({ params }: Props) => {
  const url = (await params).id;
  const id = convertToSlugWithId(url);

  if (!id) {
    return <div>Sản phẩm không tồn tại</div>;
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProductDetail productId={id} />
    </Suspense>
  );
};
export default ProductDetailPage;
