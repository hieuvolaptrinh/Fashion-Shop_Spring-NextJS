import { getProducts } from "@/core/apis/products";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lanchuyenhangsale.com";
  const currentDate = new Date("2025-08-04T00:00:00.000Z"); // Fixed date to prevent hydration mismatch

  // Static pages sitemap
  const staticSitemap: MetadataRoute.Sitemap = [
    // Trang chủ - Ưu tiên cao nhất
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Trang sản phẩm - Ưu tiên cao
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Trang giỏ hàng
    {
      url: `${baseUrl}/shopping-cart`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Trang về chúng tôi
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Trang liên hệ
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Trang đăng nhập
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Trang đăng ký
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Trang đơn hàng
    {
      url: `${baseUrl}/orders`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // Generate dynamic product sitemap
  let productSitemap: MetadataRoute.Sitemap = [];

  try {
    const products = await getProducts();

    if (products && products.length > 0) {
      productSitemap = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.productId}`,
        lastModified: new Date(product.updatedAt || currentDate),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Error generating product sitemap:", error);
    // Fallback to static product IDs if API fails
    const fallbackProductIds = [1, 2, 3, 4, 5];
    productSitemap = fallbackProductIds.map((id) => ({
      url: `${baseUrl}/products/${id}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  // Combine static and dynamic sitemaps
  return [...staticSitemap, ...productSitemap];
}
