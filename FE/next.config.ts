import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
