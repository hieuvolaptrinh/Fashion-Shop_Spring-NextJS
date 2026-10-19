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

import { BRAND } from "./brand";

export const CONTACT_DATA = {
  hero: {
    title: "Liên Hệ Với Chúng Tôi",
    description:
      "Chúng tôi luôn sẵn sàng hỗ trợ bạn tìm được những sản phẩm thời trang phong cách và ưng ý nhất. Đừng ngần ngại để lại lời nhắn hoặc kết nối trực tiếp với đội ngũ tư vấn của HALOKAKI.",
  },

  channels: [
    {
      id: "phone",
      icon: Phone,
      title: "Hotline Tư Vấn",
      value: BRAND.primaryPhone,
      description: "Gọi ngay để được hỗ trợ tức thì",
      href: `tel:${BRAND.primaryPhone.replace(/\./g, "")}`,
      actionText: "Gọi ngay",
    },
    {
      id: "zalo",
      icon: MessageCircle,
      title: "Zalo Chat Trực Tuyến",
      value: BRAND.zalo,
      description: "Nhắn tin phản hồi nhanh trong 5 phút",
      href: `https://zalo.me/${BRAND.zalo.replace(/\./g, "")}`,
      actionText: "Chat Zalo",
    },
    {
      id: "email",
      icon: Mail,
      title: "Hòm Thư Hỗ Trợ",
      value: BRAND.email,
      description: "Phản hồi thắc mắc & hỗ trợ khách hàng",
      href: `mailto:${BRAND.email}`,
      actionText: "Gửi Email",
    },
    {
      id: "working-hours",
      icon: Clock,
      title: "Giờ Phục Vụ",
      value: BRAND.workingHours,
      description: BRAND.onlineStatus,
      actionText: "Online 24/7",
    },
  ] as ContactChannel[],

  supportCategories: [
    { value: "tu-van", label: "Tư vấn chọn size & phối đồ" },
    { value: "tra-cuu-don", label: "Tra cứu tiến độ đơn hàng" },
    { value: "doi-tra", label: "Hỗ trợ đổi trả & Bảo hành sản phẩm" },
    { value: "khieu-nai", label: "Góp ý chất lượng dịch vụ" },
    { value: "khac", label: "Yêu cầu hỗ trợ khác" },
  ] as SupportCategory[],

  storeInfo: {
    name: BRAND.name,
    slogan: BRAND.slogan,
    description: BRAND.description,
    hotlines: BRAND.hotlines,
    zalo: BRAND.zalo,
    email: BRAND.email,
    website: BRAND.domain,
    fanpage: BRAND.name,
    workingHours: BRAND.workingHours,
    onlineStatus: BRAND.onlineStatus,
    productHighlights: [
      "Bộ sưu tập thời trang nam nữ xu hướng",
      "Chất liệu cao cấp, form dáng chuẩn",
      "Thiết kế trẻ trung, hiện đại & thanh lịch",
      "Phụ kiện thời trang đa dạng phong cách",
      "Ưu đãi thành viên & quà tặng hấp dẫn",
    ],
    commitments: BRAND.commitments,
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
        "Hoàn toàn có! HALOKAKI luôn khuyến khích quý khách đồng kiểm sản phẩm cùng nhân viên giao hàng trước khi thanh toán tiền mặt (Ship COD).",
    },
    {
      id: "faq-3",
      question: "Chính sách đổi trả sản phẩm được áp dụng ra sao?",
      answer:
        "Chúng tôi hỗ trợ đổi trả miễn phí trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm có lỗi từ nhà sản xuất, hư hại trong quá trình vận chuyển hoặc không vừa size.",
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
        "Sau khi gửi hàng, chúng tôi sẽ cập nhật mã vận đơn cho bạn qua số điện thoại/Zalo. Bạn có thể tra cứu trực tiếp hoặc nhắn tin vào hotline Zalo " +
        BRAND.zalo +
        " để được kiểm tra ngay.",
    },
  ] as FaqItem[],

  cta: {
    title: "Cần Hỗ Trợ Khẩn Cấp?",
    description:
      "Đội ngũ CSKH luôn túc trực để giải đáp mọi thắc mắc và giúp bạn chọn được trang phục ưng ý nhất!",
    hotline: {
      label: `Gọi Ngay: ${BRAND.primaryPhone}`,
      href: `tel:${BRAND.primaryPhone.replace(/\./g, "")}`,
    },
    zalo: {
      label: `Chat Zalo: ${BRAND.zalo}`,
      href: `https://zalo.me/${BRAND.zalo.replace(/\./g, "")}`,
    },
  },
} as const;
