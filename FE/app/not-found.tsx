import { BRAND } from "@/core/constants";

export default function NotFound() {
  return (
    <html lang="vi">
      <head>
        <title>{`Trang không tìm thấy - ${BRAND.name}`}</title>
        <meta
          name="description"
          content={`Trang bạn tìm kiếm không tồn tại trên ${BRAND.name}`}
        />

        <meta
          property="og:title"
          content={`Trang không tìm thấy - ${BRAND.name}`}
        />
        <meta
          property="og:description"
          content="Trang bạn tìm kiếm không tồn tại. Hãy quay về trang chủ để khám phá các bộ sưu tập thời trang mới nhất."
        />
        <meta property="og:url" content={BRAND.siteUrl} />
        <meta
          property="og:image"
          content={`${BRAND.siteUrl}/banner2.png`}
        />
        <meta property="og:type" content="website" />

        <meta name="robots" content="noindex, follow" />
      </head>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h1 style={{ fontSize: "4rem", color: "#0f172a", margin: "0" }}>
            404
          </h1>
          <h2
            style={{ fontSize: "1.5rem", color: "#374151", margin: "20px 0" }}
          >
            Trang không tìm thấy
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              maxWidth: "500px",
              margin: "0 0 30px 0",
            }}
          >
            Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy quay về
            trang chủ để khám phá các bộ sưu tập thời trang mới nhất.
          </p>
          <a
            href="/"
            style={{
              backgroundColor: "#0f172a",
              color: "white",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Về Trang Chủ
          </a>
        </div>
      </body>
    </html>
  );
}
