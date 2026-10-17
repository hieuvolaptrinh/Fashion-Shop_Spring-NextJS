import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Redirect API subdomain to main domain
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "api.lanchuyenhangsale.com",
          },
        ],
        destination: "https://lanchuyenhangsale.com/:path*",
        permanent: true,
      },
      // Redirect /oauth2/error to /oauth2/redirect phòng ngừa trường hợp có request cũ
      {
        source: "/oauth2/error",
        destination: "/oauth2/redirect",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
