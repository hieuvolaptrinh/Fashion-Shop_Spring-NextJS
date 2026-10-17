import {
  Clock,
  Mail,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";

export interface ContactChannel {
  id: string;
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  href?: string;
  actionText: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SupportCategory {
  value: string;
  label: string;
}

export const CONTACT_DATA = {
  hero: {
    title: "Liên Hệ Với Chúng Tôi",
    description:
      "Chúng tôi luôn sẵn sàng hỗ trợ bạn tìm được những sản phẩm sale chất lượng với giá tốt nhất. Đừng ngần ngại để lại lời nhắn hoặc kết nối trực tiếp với đội ngũ tư vấn.",
  },

  channels: [
    {
      id: "phone",
      icon: Phone,
      title: "Hotline Tư Vấn",
      value: "093.1133.128",
      description: "Gọi ngay để được hỗ trợ tức thì",
      href: "tel:0931133128",
      actionText: "Gọi ngay",
    },
    {
      id: "zalo",
      icon: MessageCircle,
      title: "Zalo Chat Trực Tuyến",
      value: "0819.314.893",
      description: "Nhắn tin phản hồi nhanh trong 5 phút",
      href: "https://zalo.me/0819314893",
      actionText: "Chat Zalo",
    },
    {
      id: "email",
      icon: Mail,
      title: "Hòm Thư Hỗ Trợ",
      value: "lanchuyenhangsale@gmail.com",
      description: "Phản hồi thắc mắc & hợp tác sỉ",
      href: "mailto:lanchuyenhangsale@gmail.com",
      actionText: "Gửi Email",
    },
    {
      id: "working-hours",
      icon: Clock,
      title: "Giờ Phục Vụ",
      value: "7:00 - 21:00 (T2 - CN)",
      description: "Bán hàng online & tiếp nhận đơn 24/7",
      actionText: "Online 24/7",
    },
  ] as ContactChannel[],

  supportCategories: [
    { value: "tu-van", label: "Tư vấn sản phẩm & Săn deal giá tốt" },
    { value: "tra-cuu-don", label: "Tra cứu tiến độ đơn hàng" },
    { value: "doi-tra", label: "Hỗ trợ đổi trả & Bảo hành sản phẩm" },
    { value: "khieu-nai", label: "Góp ý chất lượng dịch vụ" },
    { value: "khac", label: "Yêu cầu hỗ trợ khác" },
  ] as SupportCategory[],

  storeInfo: {
    name: "Lan Chuyên Hàng Sale",
    slogan: "Hàng Sale - Giá Rẻ - Chất Lượng",
    description:
      "Chuyên thanh lý, săn deal sale với giá cực ưu đãi. Đa dạng mặt hàng từ đời sống, đồ gia dụng thông minh đến thời trang và phụ kiện khuyến mãi hot.",
    hotlines: ["093.1133.128", "0819.314.893"],
    zalo: "0819.314.893",
    email: "lanchuyenhangsale@gmail.com",
    website: "lanchuyenhangsale.com",
    fanpage: "Lan Chuyên Hàng Sale",
    workingHours: "7:00 - 21:00 (T2 - CN)",
    onlineStatus: "Tiếp nhận đơn hàng online 24/7",
    productHighlights: [
      "Hàng gia dụng sale giá sốc",
      "Thời trang thanh lý tuyển chọn",
      "Đồ dùng sinh hoạt tiện ích",
      "Điện tử & Phụ kiện thông minh",
      "Flash Sale & Khuyến mãi hot",
    ],
    commitments: [
      "Được kiểm tra hàng kỹ trước khi thanh toán (Ship COD toàn quốc)",
      "Đổi trả trong 7 ngày nếu lỗi do nhà sản xuất hoặc sai lệch mô tả",
      "Tư vấn viên thân thiện, hỗ trợ nhiệt tình qua Zalo và Hotline",
    ],
  },

  faqs: [
    {
      id: "faq-1",
      question: "Thời gian giao hàng dự kiến là bao lâu?",
      answer:
        "Thời gian giao hàng từ 1 - 3 ngày làm việc tùy theo khu vực của bạn. Đối với khu vực nội thành, shop hỗ trợ giao siêu tốc trong ngày.",
    },
    {
      id: "faq-2",
      question: "Tôi có được kiểm tra hàng trước khi thanh toán không?",
      answer:
        "Hoàn toàn có! Lan Chuyên Hàng Sale luôn khuyến khích quý khách đồng kiểm sản phẩm cùng nhân viên giao hàng trước khi thanh toán tiền mặt (Ship COD).",
    },
    {
      id: "faq-3",
      question: "Chính sách đổi trả sản phẩm được áp dụng ra sao?",
      answer:
        "Chúng tôi hỗ trợ đổi trả miễn phí trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm có lỗi từ nhà sản xuất, hư hại trong quá trình vận chuyển hoặc không đúng mẫu mã đã đặt.",
    },
    {
      id: "faq-4",
      question: "Các hình thức thanh toán nào được cửa hàng chấp nhận?",
      answer:
        "Quý khách có thể lựa chọn thanh toán khi nhận hàng (COD), quét mã QR chuyển khoản ngân hàng nhanh chóng, hoặc thanh toán qua ví điện tử phổ biến.",
    },
    {
      id: "faq-5",
      question: "Làm thế nào để theo dõi tình trạng đơn hàng của tôi?",
      answer:
        "Sau khi gửi hàng, chúng tôi sẽ cập nhật mã vận đơn cho bạn qua số điện thoại/Zalo. Bạn có thể tra cứu trực tiếp hoặc nhắn tin vào hotline Zalo 0819.314.893 để được kiểm tra ngay.",
    },
  ] as FaqItem[],

  cta: {
    title: "Cần Hỗ Trợ Khẩn Cấp?",
    description:
      "Đội ngũ CSKH luôn túc trực để giải đáp mọi thắc mắc và giúp bạn chọn được deal sale ưng ý nhất!",
    hotline: {
      label: "Gọi Ngay: 093.1133.128",
      href: "tel:0931133128",
    },
    zalo: {
      label: "Chat Zalo: 0819.314.893",
      href: "https://zalo.me/0819314893",
    },
  },
} as const;
