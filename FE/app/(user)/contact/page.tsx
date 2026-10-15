import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Building,
  Clock,
  Globe,
  HeadphonesIcon,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description:
    "Liên hệ với Lan Chuyên Hàng Sale để được tư vấn và hỗ trợ nhanh chóng. Hotline: 093.1133.128 - Zalo: 0819.314.893. Chúng tôi luôn sẵn sàng phục vụ bạn 24/7.",
  keywords: [
    "liên hệ",
    "hỗ trợ khách hàng",
    "tư vấn sản phẩm",
    "hotline",
    "Lan chuyên hàng sale",
    "chăm sóc khách hàng",
  ],
  openGraph: {
    title: "Liên Hệ - Lan Chuyên Hàng Sale",
    description:
      "Liên hệ với chúng tôi để được tư vấn và hỗ trợ về sản phẩm sale chất lượng. Hotline: 093.1133.128, hỗ trợ 24/7.",
    url: "https://lanchuyenhangsale.com/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com/contact",
  },
};

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Điện thoại",
      value: "093.1133.128",
      description: "Gọi ngay để được tư vấn",
      color: "text-green-600",
    },
    {
      icon: MessageCircle,
      title: "Zalo",
      value: "0819.314.893",
      description: "Chat trực tiếp qua Zalo",
      color: "text-blue-600",
    },
    {
      icon: Mail,
      title: "Email",
      value: "lanchuyenhangsale@gmail.com",
      description: "Gửi email cho chúng tôi",
      color: "text-red-600",
    },
    {
      icon: Globe,
      title: "Website",
      value: "lanchuyenhangsale.com",
      description: "Truy cập website chính thức",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      {/* Hero Banner */}
      <div className="relative flex h-[250px] justify-center overflow-hidden bg-gradient-to-r from-rose-900 to-red-600 sm:h-[300px] md:h-[400px]">
        <div className="relative container flex h-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:mb-4 sm:text-4xl md:text-5xl">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="max-w-2xl text-sm text-rose-100 sm:text-xl">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn tìm được những sản phẩm sale chất
            lượng với giá tốt nhất
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Contact Methods */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-6 lg:grid-cols-4">
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              className="border-rose-100 bg-white transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-3 text-center sm:p-6">
                <div className={`mb-2 flex justify-center sm:mb-4`}>
                  <method.icon
                    className={`h-8 w-8 sm:h-12 sm:w-12 ${method.color}`}
                  />
                </div>
                <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-lg">
                  {method.title}
                </h3>
                <p
                  className={`mb-1 text-xs font-medium sm:mb-2 sm:text-lg ${method.color} line-clamp-1`}
                >
                  {method.value}
                </p>

                <p className="line-clamp-1 text-[10px] text-gray-600 sm:text-sm">
                  {method.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="border-rose-100 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-rose-800 sm:text-2xl">
                <Send className="h-5 w-5 sm:h-6 sm:w-6" />
                Gửi Tin Nhắn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm text-gray-700 sm:text-base"
                    >
                      Họ và tên *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="border-rose-200 text-sm focus-visible:ring-rose-500 sm:text-base"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm text-gray-700 sm:text-base"
                    >
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="border-rose-200 text-sm focus-visible:ring-rose-500 sm:text-base"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm text-gray-700 sm:text-base"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="border-rose-200 text-sm focus-visible:ring-rose-500 sm:text-base"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="subject"
                    className="text-sm text-gray-700 sm:text-base"
                  >
                    Chủ đề *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="border-rose-200 text-sm focus-visible:ring-rose-500 sm:text-base"
                    placeholder="Nhập chủ đề"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm text-gray-700 sm:text-base"
                  >
                    Nội dung *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    className="min-h-24 border-rose-200 text-sm focus-visible:ring-rose-500 sm:min-h-32 sm:text-base"
                    placeholder="Nhập nội dung tin nhắn..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-3 text-sm text-white hover:from-rose-700 hover:to-red-700 sm:py-6 sm:text-lg"
                >
                  <Send className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                  Gửi Tin Nhắn
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Office Information */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-rose-100 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-rose-800 sm:text-2xl">
                  <Building className="h-5 w-5 sm:h-6 sm:w-6" />
                  Thông Tin Shop
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-rose-600 sm:text-lg">
                    Lan Chuyên Hàng Sale
                  </h3>
                  <p className="mb-1 text-xs text-gray-500 italic sm:mb-2 sm:text-sm">
                    "Hàng Sale - Giá Rẻ - Chất Lượng"
                  </p>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Chuyên thanh lý, hàng sale với giá cực ưu đãi. Đa dạng mặt
                    hàng từ đời sống, gia dụng, điện tử đến các sản phẩm khuyến
                    mãi hot.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                  <a
                    href="https://lanchuyenhangsale.com"
                    className="text-xs text-gray-700 transition-colors hover:text-blue-600 sm:text-base"
                  >
                    lanchuyenhangsale.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                  <span className="text-xs text-gray-700 sm:text-base">
                    Fanpage: Lan Chuyên Hàng Sale
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
                  <span className="text-xs text-gray-700 sm:text-base">
                    Hotline: 093.1133.128 - 0819.314.893
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
                  <div>
                    <span className="block text-xs text-gray-700 sm:text-base">
                      Giờ mở cửa: 7:00 - 21:00 (T2 - CN)
                    </span>
                    <span className="text-[10px] text-green-600 sm:text-sm">
                      Bán hàng online 24/7
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            <Card className="border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg">
              <CardContent className="p-3 sm:p-6">
                <h3 className="mb-2 text-sm font-semibold text-rose-600 sm:mb-4 sm:text-lg">
                  Chuyên mục hàng hóa
                </h3>
                <div className="grid grid-cols-1 gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-400 sm:h-2 sm:w-2"></div>
                    <span className="text-xs text-gray-700 sm:text-sm">
                      Hàng gia dụng sale
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400 sm:h-2 sm:w-2"></div>
                    <span className="text-xs text-gray-700 sm:text-sm">
                      Điện tử - Điện lạnh
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 sm:h-2 sm:w-2"></div>
                    <span className="text-xs text-gray-700 sm:text-sm">
                      Thời trang thanh lý
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400 sm:h-2 sm:w-2"></div>
                    <span className="text-xs text-gray-700 sm:text-sm">
                      Đồ dùng sinh hoạt
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 sm:h-2 sm:w-2"></div>
                    <span className="text-xs text-gray-700 sm:text-sm">
                      Hàng hot - Khuyến mãi
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 rounded-2xl border border-rose-100 bg-white p-4 shadow-lg sm:mt-16 sm:p-8">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900 sm:mb-8 sm:text-3xl">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2">
            {[
              {
                question: "Thời gian giao hàng là bao lâu?",
                answer:
                  "Thời gian giao hàng từ 1-3 ngày làm việc tùy theo khu vực. Nội thành Hà Nội và TP.HCM giao trong ngày.",
              },
              {
                question: "Có hỗ trợ đổi trả sản phẩm không?",
                answer:
                  "Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc không đúng mô tả.",
              },
              {
                question: "Các hình thức thanh toán được hỗ trợ?",
                answer:
                  "Chúng tôi hỗ trợ thanh toán COD, chuyển khoản ngân hàng, và các ví điện tử phổ biến.",
              },
              {
                question: "Làm thế nào để theo dõi đơn hàng?",
                answer:
                  "Bạn có thể theo dõi đơn hàng qua website hoặc liên hệ hotline. Chúng tôi sẽ cung cấp mã vận đơn sau khi gửi hàng.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-rose-100 bg-rose-50">
                <CardContent className="p-3 sm:p-6">
                  <h3 className="mb-2 text-sm font-semibold text-rose-800 sm:mb-3 sm:text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-gray-700 sm:text-base">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-600 to-red-600 p-4 text-center text-white shadow-lg sm:mt-16 sm:p-8">
          <HeadphonesIcon className="mx-auto mb-2 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
          <h2 className="mb-2 text-xl font-bold sm:mb-4 sm:text-3xl">
            Cần Hỗ Trợ Ngay Lập Tức?
          </h2>
          <p className="mb-4 text-sm sm:mb-6 sm:text-xl">
            Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn tìm được deal sale hot nhất!
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <Button
              className="rounded-xl bg-white px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 sm:px-8 sm:py-6 sm:text-lg"
              asChild
            >
              <a href="tel:0819314893">
                <Phone className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                Gọi Ngay: 0819.314.893
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
                Chat Zalo
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
