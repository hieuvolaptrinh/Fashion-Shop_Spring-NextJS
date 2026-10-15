import type { MetadataRoute } from "next";

// tăng trải nghiệm người dùng với manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lan Chuyên Hàng Sale",
    short_name: "LanSale",
    description:
      "Chuyên cung cấp sản phẩm sale, giá rẻ, uy tín, chất lượng cao. Hàng gia dụng, sức khỏe, làm đẹp với giá ưu đãi nhất.",
    icons: [
      {
        src: "/logo.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    theme_color: "#dc2626",
    background_color: "#ffffff",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    categories: ["shopping", "lifestyle", "health"],
  };
}
