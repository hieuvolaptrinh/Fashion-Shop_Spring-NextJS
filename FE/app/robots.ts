import type { MetadataRoute } from "next";
import { BRAND } from "@/core/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/*", "/api/*", "/oauth2/*", "/_next/*", "/private/*"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/*", "/api/*", "/oauth2/*", "/_next/*", "/private/*"],
      },
    ],
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
    host: BRAND.siteUrl,
  };
}
