import { ImageResponse } from "next/og";
import { BRAND } from "@/core/constants";

// Image metadata
export const alt = `${BRAND.name} - ${BRAND.slogan}`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "60px",
            margin: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              letterSpacing: "4px",
              color: "#0f172a",
              margin: "0 0 16px 0",
              lineHeight: "1.1",
            }}
          >
            {BRAND.name}
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#374151",
              margin: "0",
              maxWidth: "800px",
              lineHeight: "1.3",
            }}
          >
            {BRAND.slogan}
          </p>
          <p
            style={{
              fontSize: "22px",
              color: "#6b7280",
              margin: "16px 0 0 0",
              lineHeight: "1.3",
            }}
          >
            Thời Trang Nam Nữ • Xu Hướng Mới • Giao Hàng Toàn Quốc
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
