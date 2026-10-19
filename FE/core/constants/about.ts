import { BRAND } from "./brand";
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
    badge: `Thời trang ${BRAND.name}`,
    title: "Về Chúng Tôi",
    description:
      "Chuyên cung cấp các sản phẩm thời trang chất lượng cao, bắt kịp xu hướng với mức giá hợp lý nhất",
    hotline: {
      label: `Gọi ngay: ${BRAND.primaryPhone}`,
      href: `tel:${BRAND.primaryPhone.replace(/\./g, "")}`,
    },
    zalo: {
      label: `Zalo: ${BRAND.zalo}`,
      href: `https://zalo.me/${BRAND.zalo.replace(/\./g, "")}`,
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
        highlight: `Thời trang ${BRAND.name}`,
        text: " khởi nguồn từ đam mê mang đến phong cách thời trang hiện đại, thanh lịch và chất lượng cho mọi người. Chúng tôi tin rằng ",
        boldHighlight: "ai cũng xứng đáng tỏa sáng trong những bộ trang phục đẹp",
        ending: " với chi phí hợp lý nhất.",
      },
      {
        lead: "Hành trình ",
        boldLead: "hơn 10 năm",
        text: " phát triển đã giúp chúng tôi xây dựng được chuỗi cung ứng uy tín, luôn cập nhật những ",
        highlight: "xu hướng mới nhất, chất liệu chọn lọc",
        ending:
          " từ các nhà sản xuất hàng đầu. Từ trang phục thường ngày, công sở đến dạ tiệc và phụ kiện - tất cả đều được tuyển chọn kỹ lưỡng để đảm bảo phom dáng và độ bền tối ưu.",
      },
      {
        lead: "Với phương châm ",
        highlight: `"${BRAND.slogan}"`,
        text: ', chúng tôi tự hào đã đồng hành cùng hàng nghìn khách hàng trên khắp cả nước định hình phong cách cá nhân, đảm bảo ',
        boldEnding: '"Chất lượng cao cấp - Trải nghiệm hoàn hảo".',
      },
      {
        isCallout: true,
        text: "Chúng tôi không chỉ cung cấp trang phục, mà còn là người bạn đồng hành giúp bạn luôn tự tin và phong cách trong mọi khoảnh khắc!",
      },
    ],
  },

  coreValues: [
    {
      icon: CheckCircle,
      title: "Chất lượng hàng đầu",
      description:
        "Cam kết mang đến sản phẩm thời trang chất lượng với mức giá hợp lý nhất",
    },
    {
      icon: Heart,
      title: "Phục vụ tận tình",
      description:
        "Đội ngũ nhiệt tình, luôn sẵn sàng tư vấn phối đồ và hỗ trợ khách hàng mọi lúc",
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
      role: "Chuyên viên thời trang",
      description: "Nhiệt tình tư vấn size và phong cách, giúp khách hàng tìm được trang phục ưng ý",
      image: IMAGES.SUPPORT.TUVAN,
    },
    {
      name: "Bộ phận CSKH",
      role: "Hỗ trợ 24/7",
      description:
        "Luôn sẵn sàng giải đáp thắc mắc và hỗ trợ khách hàng nhanh chóng",
      image: IMAGES.SUPPORT.HOTRO,
    },
  ] as TeamMember[],

  contactInfo: {
    company: {
      name: BRAND.name,
      website: BRAND.domain,
      hotline: BRAND.primaryPhone,
      orderPhone: BRAND.zalo,
      zalo: BRAND.primaryPhone,
    },
    policies: BRAND.policies,
    payments: ["COD", "Chuyển khoản", "Ví điện tử"],
    commitments: [
      "Hàng chất lượng - Giá tốt nhất",
      "Dịch vụ tận tâm - Uy tín lâu dài",
    ],
  },
} as const;
