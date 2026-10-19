import type { MetadataRoute } from "next";
import { BRAND } from "@/core/constants";

// tăng trải nghiệm người dùng với manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    description: BRAND.description,
    icons: [
      {
        src: "/logo-1.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/logo-1.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    theme_color: "#0f172a",
    background_color: "#ffffff",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    categories: ["shopping", "lifestyle", "fashion"],
  };
}
