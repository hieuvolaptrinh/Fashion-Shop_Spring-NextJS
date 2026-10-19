/**
 * Định nghĩa tập trung toàn bộ thông tin thương hiệu (Brand Identity)
 * Dễ dàng cập nhật khi khách hàng cung cấp thông tin chính thức.
 */
export const BRAND = {
  name: "HALOKAKI",
  shortName: "HALOKAKI",
  tagline: "Fashion Store",
  slogan: "Thời Trang Phong Cách & Hiện Đại",
  description:
    "Thương hiệu thời trang HALOKAKI - Chuyên cung cấp các sản phẩm thời trang phong cách, hiện đại và chất lượng cao.",

  // Thông tin liên hệ
  email: "halokaki@gmail.com",
  domain: "halokaki.com",
  siteUrl: "https://halokaki.com",
  hotlines: ["093.1133.128", "0819.314.893"],
  primaryPhone: "093.1133.128",
  zalo: "0819.314.893",
  workingHours: "7:00 - 21:00 (T2 - CN)",
  onlineStatus: "Tiếp nhận đơn hàng online 24/7",

  // Tài khoản ngân hàng (Để trống/null = ẩn hoàn toàn trên giao diện theo quyết định)
  bankAccount: null as {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  } | null,

  // Mạng xã hội / Fanpage (Để rỗng = ẩn hoàn toàn trên giao diện)
  fanpages: [] as Array<{ label: string; href: string }>,
  facebookUrl: "",

  // Cam kết & chính sách
  commitments: [
    "Được kiểm tra hàng kỹ trước khi thanh toán (Ship COD toàn quốc)",
    "Đổi trả trong 7 ngày nếu lỗi do nhà sản xuất hoặc sai lệch mô tả",
    "Tư vấn viên thân thiện, hỗ trợ nhiệt tình qua Zalo và Hotline",
  ],
  policies: {
    businessHours: "7:00 - 21:00 (T2 - CN)",
    onlineHours: "Online 24/7",
    returns: "7 ngày đổi trả miễn phí",
    shipping: "COD toàn quốc",
    freeship: "Freeship đơn từ 200k",
  },
} as const;
