import { IMAGES } from "@/core/constants/images";
import {
  Award,
  CheckCircle,
  Heart,
  Shield,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface CompanyStat {
  icon: LucideIcon;
  number: string;
  label: string;
}

export interface CoreValue {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

export const ABOUT_DATA = {
  hero: {
    badge: "Shop Lan Chuyên Hàng Sale",
    title: "Về Chúng Tôi",
    description:
      "Chuyên cung cấp hàng sale, thanh lý với giá cực ưu đãi - Đa dạng mặt hàng từ đời sống, gia dụng đến điện tử",
    hotline: {
      label: "Gọi ngay: 093.1133.128",
      href: "tel:0931133128",
    },
    zalo: {
      label: "Zalo: 0819.314.893",
      href: "https://zalo.me/0819314893",
    },
  },

  stats: [
    {
      icon: Users,
      number: "50,000+",
      label: "Khách hàng hài lòng",
    },
    {
      icon: Award,
      number: "10+",
      label: "Năm kinh nghiệm",
    },
    {
      icon: Shield,
      number: "100%",
      label: "Hàng chất lượng",
    },
    {
      icon: Heart,
      number: "24/7",
      label: "Tư vấn online",
    },
  ] as CompanyStat[],

  story: {
    title: "Câu Chuyện Của Chúng Tôi",
    paragraphs: [
      {
        highlight: "Shop Lan Chuyên Hàng Sale",
        text: " khởi nguồn từ đam mê tìm kiếm và chia sẻ những sản phẩm chất lượng với giá cả phải chăng cho mọi người. Chúng tôi tin rằng ",
        boldHighlight: "ai cũng xứng đáng có được những món đồ tốt",
        ending: " mà không cần phải chi quá nhiều tiền.",
      },
      {
        lead: "Hành trình ",
        boldLead: "hơn 10 năm",
        text: " kinh doanh đã giúp chúng tôi xây dựng được mạng lưới nhà cung cấp uy tín, luôn cập nhật những ",
        highlight: "deal HOT, hàng sale chất lượng",
        ending:
          " từ nhiều nguồn khác nhau. Từ đồ gia dụng, điện tử, thời trang đến các sản phẩm đời sống - tất cả đều được tuyển chọn kỹ lưỡng để đảm bảo chất lượng tốt với giá cực ưu đãi.",
      },
      {
        lead: "Với phương châm ",
        highlight: '"Hàng Sale - Giá Rẻ - Chất Lượng"',
        text: ', chúng tôi tự hào đã mang đến niềm vui mua sắm cho hàng nghìn khách hàng trên toàn quốc. Mỗi sản phẩm đều được kiểm tra kỹ càng trước khi đến tay khách hàng, đảm bảo ',
        boldEnding: '"Giá rẻ nhưng chất lượng không rẻ".',
      },
      {
        isCallout: true,
        text: "Chúng tôi không chỉ bán hàng, mà còn là người bạn đồng hành giúp bạn tiết kiệm chi phí mà vẫn sở hữu được những sản phẩm ưng ý!",
      },
    ],
  },

  coreValues: [
    {
      icon: CheckCircle,
      title: "Giá rẻ - Chất lượng",
      description:
        "Cam kết mang đến sản phẩm chất lượng với giá cả hợp lý nhất thị trường",
    },
    {
      icon: Heart,
      title: "Phục vụ tận tình",
      description:
        "Đội ngũ nhiệt tình, luôn sẵn sàng tư vấn và hỗ trợ khách hàng mọi lúc",
    },
    {
      icon: Truck,
      title: "Giao hàng nhanh",
      description: "Ship COD toàn quốc, giao hàng nhanh và đảm bảo an toàn",
    },
    {
      icon: Shield,
      title: "Đổi trả dễ dàng",
      description:
        "Chính sách đổi trả linh hoạt, bảo vệ quyền lợi tối đa cho khách hàng",
    },
  ] as CoreValue[],

  teamMembers: [
    {
      name: "Đội ngũ giao hàng",
      role: "Shipper chuyên nghiệp",
      description:
        "Đảm bảo giao hàng đúng hẹn, cẩn thận và luôn giữ chất lượng sản phẩm như ban đầu.",
      image: IMAGES.SUPPORT.SHIPPER,
    },
    {
      name: "Đội ngũ tư vấn",
      role: "Chuyên viên bán hàng",
      description: "Nhiệt tình tư vấn, giúp khách hàng tìm được sản phẩm ưng ý",
      image: IMAGES.SUPPORT.TUVAN,
    },
    {
      name: "Bộ phận CSKH",
      role: "Hỗ trợ 24/7",
      description:
        "Luôn sẵn sàng giải đáp thắc mắc và xử lý đơn hàng nhanh chóng",
      image: IMAGES.SUPPORT.HOTRO,
    },
  ] as TeamMember[],

  contactInfo: {
    company: {
      name: "Shop Lan Chuyên Hàng Sale",
      website: "lanchuyenhangsale.com",
      hotline: "093.1133.128",
      orderPhone: "0819.314.893",
      zalo: "093.1133.128",
    },
    policies: {
      businessHours: "7:00 - 21:00 (T2 - CN)",
      onlineHours: "Online 24/7",
      returns: "7 ngày đổi trả miễn phí",
      shipping: "COD toàn quốc",
      freeship: "Freeship đơn từ 200k",
    },
    payments: ["COD", "Chuyển khoản", "Ví điện tử"],
    commitments: [
      "Hàng chất lượng - Giá tốt nhất",
      "Dịch vụ tận tâm - Uy tín lâu dài",
    ],
  },

  cta: {
    title: "Sẵn Sàng Phục Vụ Bạn!",
    description:
      "Hãy để chúng tôi giúp bạn tìm được những sản phẩm chất lượng với giá cả hợp lý nhất!",
    primaryButton: "Xem Hàng Sale",
    secondaryButton: "Liên Hệ Ngay",
  },
} as const;
