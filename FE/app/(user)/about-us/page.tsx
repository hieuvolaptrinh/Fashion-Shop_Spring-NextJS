import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import {
  Award,
  CheckCircle,
  Clock,
  Globe,
  HeadphonesIcon,
  Heart,
  MessageCircle,
  Phone,
  Shield,
  Star,
  Truck,
  Users,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về Chúng Tôi - Lan Chuyên Hàng Sale Là Ai?",
  description:
    "Khám phá câu chuyện và sứ mệnh của Lan Chuyên Hàng Sale - 10+ năm kinh nghiệm cung cấp sản phẩm sale chính hãng, chất lượng cao với giá ưu đãi nhất. 50,000+ khách hàng tin tưởng.",
  keywords: [
    "về chúng tôi",
    "Lan chuyên hàng sale",
    "câu chuyện thương hiệu",
    "kinh nghiệm",
    "uy tín",
    "chất lượng",
    "sứ mệnh",
  ],
  openGraph: {
    title: "Về Chúng Tôi - Lan Chuyên Hàng Sale",
    description:
      "10+ năm kinh nghiệm trong lĩnh vực cung cấp sản phẩm sale chính hãng. 50,000+ khách hàng hài lòng, cam kết chất lượng 100%.",
    url: "https://lanchuyenhangsale.com/about-us",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Lan Chuyên Hàng Sale - Về chúng tôi",
      },
    ],
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com/about-us",
  },
};

const AboutUs = () => {
  const companyStats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Khách hàng hài lòng",
      color: "text-blue-600",
    },
    {
      icon: Award,
      number: "10+",
      label: "Năm kinh nghiệm",
      color: "text-green-600",
    },
    {
      icon: Shield,
      number: "100%",
      label: "Hàng chất lượng",
      color: "text-purple-600",
    },
    {
      icon: Heart,
      number: "24/7",
      label: "Tư vấn online",
      color: "text-red-600",
    },
  ];

  // const productCategories = [
  //   {
  //     icon: Heart,
  //     title: "Hàng gia dụng sale",
  //     description:
  //       "Đồ dùng nhà bếp, dụng cụ sinh hoạt, vật dụng gia đình giá ưu đãi",
  //     color: "bg-red-50 text-red-600",
  //   },
  //   {
  //     icon: Sparkles,
  //     title: "Điện tử - Điện lạnh",
  //     description:
  //       "Thiết bị điện tử, đồ gia dụng điện, hàng thanh lý chất lượng",
  //     color: "bg-pink-50 text-pink-600",
  //   },
  //   {
  //     icon: Target,
  //     title: "Thời trang thanh lý",
  //     description: "Quần áo, phụ kiện thời trang, túi xách với giá cực sốc",
  //     color: "bg-green-50 text-green-600",
  //   },
  //   {
  //     icon: Shield,
  //     title: "Hàng hot khuyến mãi",
  //     description: "Sản phẩm HOT, deal giá tốt, hàng mới về liên tục",
  //     color: "bg-blue-50 text-blue-600",
  //   },
  // ];

  const coreValues = [
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
  ];

  const teamMembers = [
    {
      name: "Đội ngũ giao hàng",
      role: "Shipper chuyên nghiệp",
      description:
        "Đảm bảo giao hàng đúng hẹn, cẩn thận và luôn giữ chất lượng sản phẩm như ban đầu. ",
      image: "/shipper.jpg",
    },
    {
      name: "Đội ngũ tư vấn",
      role: "Chuyên viên bán hàng",
      description: "Nhiệt tình tư vấn, giúp khách hàng tìm được sản phẩm ưng ý",
      image: "/tuVan.png",
    },
    {
      name: "Bộ phận CSKH",
      role: "Hỗ trợ 24/7",
      description:
        "Luôn sẵn sàng giải đáp thắc mắc và xử lý đơn hàng nhanh chóng",
      image: "/hoTro.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      {/* Hero Banner */}
      <div className="relative flex h-[300px] justify-center overflow-hidden bg-gradient-to-r from-rose-900 to-red-600 sm:h-[400px] md:h-[500px]">
        <div className="relative container flex h-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12">
          <Badge className="mb-2 bg-white/20 px-2 py-1 text-xs text-white sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
            <Star className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Shop Lan Chuyên Hàng Sale
          </Badge>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:mb-4 sm:text-4xl md:text-6xl">
            Về Chúng Tôi
          </h1>
          <p className="max-w-3xl text-sm text-rose-100 sm:text-xl md:text-2xl">
            Chuyên cung cấp hàng sale, thanh lý với giá cực ưu đãi - Đa dạng mặt
            hàng từ đời sống, gia dụng đến điện tử
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-4">
            <Button
              className="rounded-xl bg-white px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 sm:px-8 sm:py-6 sm:text-lg"
              asChild
            >
              <a href="tel:0931133128">
                <Phone className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                Gọi ngay: 093.1133.128
              </a>
            </Button>
            <Button
              className="rounded-xl border-2 border-white bg-transparent px-4 py-3 text-sm text-white hover:bg-white hover:text-rose-600 sm:px-8 sm:py-6 sm:text-lg"
              asChild
            >
              <a
                href="https://zalo.me/0819314893"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                Zalo: 0819.314.893
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-16">
        {/* Company Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-16 sm:gap-6 md:grid-cols-4">
          {companyStats.map((stat, index) => (
            <Card
              key={index}
              className="border-rose-100 bg-white text-center shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <CardContent className="p-3 sm:p-6">
                <div className="mb-2 flex justify-center sm:mb-4">
                  <stat.icon
                    className={`h-8 w-8 sm:h-12 sm:w-12 ${stat.color}`}
                  />
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900 sm:mb-2 sm:text-3xl">
                  {stat.number}
                </h3>
                <p className="text-xs text-gray-600 sm:text-base">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Story */}
        <div className="mb-8 grid grid-cols-1 gap-8 sm:mb-16 sm:gap-12">
          <div className="lg:col-span-7">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-3xl">
              Câu Chuyện Của Chúng Tôi
            </h2>
            <div className="space-y-4 text-sm text-gray-700 sm:space-y-6 sm:text-lg">
              <p>
                <strong className="text-rose-600">
                  Shop Lan Chuyên Hàng Sale{" "}
                </strong>{" "}
                khởi nguồn từ đam mê tìm kiếm và chia sẻ những sản phẩm chất
                lượng với giá cả phải chăng cho mọi người. Chúng tôi tin rằng{" "}
                <strong className="text-rose-600">
                  ai cũng xứng đáng có được những món đồ tốt
                </strong>{" "}
                mà không cần phải chi quá nhiều tiền.
              </p>
              <p>
                Hành trình <strong>hơn 10 năm</strong> kinh doanh đã giúp chúng
                tôi xây dựng được mạng lưới nhà cung cấp uy tín, luôn cập nhật
                những{" "}
                <strong className="text-rose-600">
                  deal HOT, hàng sale chất lượng
                </strong>{" "}
                từ nhiều nguồn khác nhau. Từ đồ gia dụng, điện tử, thời trang
                đến các sản phẩm đời sống - tất cả đều được tuyển chọn kỹ lưỡng
                để đảm bảo chất lượng tốt với giá cực ưu đãi.
              </p>
              <p>
                Với phương châm{" "}
                <strong className="text-rose-600">
                  "Hàng Sale - Giá Rẻ - Chất Lượng"
                </strong>
                , chúng tôi tự hào đã mang đến niềm vui mua sắm cho hàng nghìn
                khách hàng trên toàn quốc. Mỗi sản phẩm đều được kiểm tra kỹ
                càng trước khi đến tay khách hàng, đảm bảo{" "}
                <strong>"Giá rẻ nhưng chất lượng không rẻ"</strong>.
              </p>
              <p className="font-semibold text-rose-600">
                🎯 Chúng tôi không chỉ bán hàng, mà còn là người bạn đồng hành
                giúp bạn tiết kiệm chi phí mà vẫn sở hữu được những sản phẩm ưng
                ý!
              </p>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        {/* <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Danh Mục Sản Phẩm
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {productCategories.map((category, index) => (
              <Card
                key={index}
                className="border-rose-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${category.color}`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}

        {/* Core Values */}
        <div className="mb-8 rounded-2xl border border-rose-100 bg-white p-4 shadow-lg sm:mb-16 sm:p-8">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900 sm:mb-8 sm:text-3xl">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2">
            {coreValues.map((value, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 sm:h-12 sm:w-12">
                  <value.icon className="h-4 w-4 text-rose-600 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-gray-900 sm:mb-2 sm:text-xl">
                    {value.title}
                  </h3>
                  <p className="text-xs text-gray-600 sm:text-base">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-8 sm:mb-16">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900 sm:mb-8 sm:text-3xl">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="border-rose-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="p-4 text-center sm:p-6">
                  <div className="mb-2 flex justify-center sm:mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-16 w-16 rounded-full object-cover sm:h-24 sm:w-24"
                    />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-gray-900 sm:mb-2 sm:text-xl">
                    {member.name}
                  </h3>
                  <p className="mb-2 text-xs font-medium text-rose-600 sm:mb-3 sm:text-base">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-600 sm:text-base">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8 rounded-2xl border border-rose-100 bg-white p-4 shadow-lg sm:mb-16 sm:p-8">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900 sm:mb-8 sm:text-3xl">
            Thông Tin Liên Hệ
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Company Info */}
            <div>
              <h3 className="mb-2 text-sm font-bold text-rose-600 sm:mb-4 sm:text-xl">
                Shop Lan Chuyên Hàng Sale
              </h3>
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Globe className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-base">
                    Website: lanchuyenhangsale.com
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Phone className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-base">
                    Hotline: 093.1133.128
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Phone className="h-4 w-4 text-orange-600 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-base">
                    Đặt hàng: 0819.314.893
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <MessageCircle className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-base">
                    Zalo: 093.1133.128
                  </span>
                </div>
              </div>
            </div>

            {/* Business Hours & Policies */}
            <div>
              <h3 className="mb-2 text-sm font-bold text-rose-600 sm:mb-4 sm:text-xl">
                Thời gian & Chính sách
              </h3>
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-purple-600 sm:mt-1 sm:h-5 sm:w-5" />
                  <div>
                    <p className="text-xs font-semibold sm:text-base">
                      Giờ bán hàng:
                    </p>
                    <p className="text-[10px] text-gray-600 sm:text-sm">
                      7:00 - 21:00 (T2 - CN)
                    </p>
                    <p className="text-[10px] text-green-600 sm:text-sm">
                      Online 24/7
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Shield className="mt-0.5 h-4 w-4 text-green-600 sm:mt-1 sm:h-5 sm:w-5" />
                  <div>
                    <p className="text-xs font-semibold sm:text-base">
                      Đổi trả:
                    </p>
                    <p className="text-[10px] text-gray-600 sm:text-sm">
                      7 ngày đổi trả miễn phí
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Truck className="mt-0.5 h-4 w-4 text-blue-600 sm:mt-1 sm:h-5 sm:w-5" />
                  <div>
                    <p className="text-xs font-semibold sm:text-base">
                      Giao hàng:
                    </p>
                    <p className="text-[10px] text-gray-600 sm:text-sm">
                      COD toàn quốc
                    </p>
                    <p className="text-[10px] text-gray-600 sm:text-sm">
                      Freeship đơn từ 200k
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Social */}
            <div>
              <h3 className="mb-2 text-sm font-bold text-rose-600 sm:mb-4 sm:text-xl">
                Thanh toán & Kết nối
              </h3>
              <div className="space-y-2 sm:space-y-4">
                <div>
                  <p className="mb-1 text-xs font-semibold sm:mb-2 sm:text-base">
                    Phương thức thanh toán:
                  </p>
                  <div className="flex flex-wrap gap-1 text-[10px] sm:gap-2 sm:text-sm">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 sm:px-3 sm:py-1">
                      COD
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 sm:px-3 sm:py-1">
                      Chuyển khoản
                    </span>
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-purple-700 sm:px-3 sm:py-1">
                      Ví điện tử
                    </span>
                  </div>
                </div>

                <div className="mt-2 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 p-2 sm:mt-4 sm:p-3">
                  <p className="text-[10px] font-semibold text-rose-600 sm:text-sm">
                    🎯 Cam kết:
                  </p>
                  <p className="text-[9px] text-gray-600 sm:text-xs">
                    Hàng chất lượng - Giá tốt nhất
                  </p>
                  <p className="text-[9px] text-gray-600 sm:text-xs">
                    Dịch vụ tận tâm - Uy tín lâu dài
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-600 to-red-600 p-6 text-center text-white shadow-lg sm:p-12">
          <HeadphonesIcon className="mx-auto mb-3 h-12 w-12 sm:mb-6 sm:h-20 sm:w-20" />
          <h2 className="mb-2 text-2xl font-bold sm:mb-4 sm:text-4xl">
            Sẵn Sàng Phục Vụ Bạn!
          </h2>
          <p className="mb-4 text-sm sm:mb-8 sm:text-xl">
            Hãy để chúng tôi giúp bạn tìm được những sản phẩm chất lượng với giá
            cả hợp lý nhất!
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <Button
              className="rounded-xl bg-white px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 sm:px-8 sm:py-6 sm:text-lg"
              asChild
            >
              <a href="/products">
                <Star className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                Xem Hàng Sale
              </a>
            </Button>
            <Button
              className="rounded-xl border-2 border-white bg-transparent px-4 py-3 text-sm text-white hover:bg-white hover:text-rose-600 sm:px-8 sm:py-6 sm:text-lg"
              asChild
            >
              <a href="/contact">
                <MessageCircle className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                Liên Hệ Ngay
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
