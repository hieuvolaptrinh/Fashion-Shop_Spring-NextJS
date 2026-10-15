import { ImageResponse } from "next/og";

// Image metadata
export const alt =
  "Lan Chuyên Hàng Sale - Sản phẩm chính hãng cho sức khỏe & sắc đẹp";
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
          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
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
              color: "#dc2626",
              margin: "0 0 20px 0",
              lineHeight: "1.1",
            }}
          >
            Lan Chuyên Hàng Sale
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
            10+ năm kinh nghiệm cung cấp sản phẩm sale chính hãng
          </p>
          <p
            style={{
              fontSize: "24px",
              color: "#6b7280",
              margin: "20px 0 0 0",
              lineHeight: "1.3",
            }}
          >
            Sức khỏe • Làm đẹp • Gia dụng • Giá ưu đãi nhất
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
