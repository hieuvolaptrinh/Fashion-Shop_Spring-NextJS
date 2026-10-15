import { Facebook } from "@mui/icons-material";
import { Banknote, MessageCircle, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Company Info */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Company Info */}
          <div className="lg:col-span-7">
            <h3 className="mb-4 text-xl font-bold text-blue-400">
              Lan Chuyên Hàng Sale
            </h3>
            <p className="mb-4 text-sm text-gray-300 italic">
              "Hàng Sale - Giá Rẻ - Chất Lượng"
            </p>
            <p className="mb-4 text-sm text-gray-400">
              Chuyên thanh lý, hàng sale với giá cực ưu đãi. Đa dạng mặt hàng từ
              đời sống, gia dụng, điện tử đến các sản phẩm khuyến mãi hot.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Banknote className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                <a href="#" className="transition-colors hover:text-blue-400">
                  MB: 0937429455-NGUYEN THI MONG LAN
                </a>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-5">
            <h4 className="mb-4 text-lg font-semibold text-blue-400">
              Thông tin liên hệ
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-blue-400" />
                <span className="text-sm">093.1133.128 - 08.193.148.93</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 flex-shrink-0 text-blue-400" />
                <span className="text-sm">
                  Zalo: 093.1133.128 - 08.193.148.93
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Facebook className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                <a
                  href="https://lanchuyenhangsale.com"
                  className="transition-colors hover:text-blue-400"
                >
                  Fanpage: Lan Chuyên Hàng Sale
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Facebook className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                <a
                  href="https://lanchuyenhangsale.com"
                  className="transition-colors hover:text-blue-400"
                >
                  Fanpage: Hàng Hiệu Thông Minh
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Facebook className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                <a
                  href="https://lanchuyenhangsale.com"
                  className="transition-colors hover:text-blue-400"
                >
                  Fanpage: Lan Chuyên Hàng Thanh Lý
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dealer Network */}
        {/* <div className="mb-8">
          <h3 className="mb-6 text-center text-xl font-bold text-blue-400">
            Hệ Thống Đại Lý Ủy Quyền
          </h3>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h4 className="mb-4 text-lg font-semibold text-green-400">
                Khu Vực Miền Bắc
              </h4>
              <div className="space-y-4">
                {northernDealers.map((province) => (
                  <div
                    key={province.id}
                    className="rounded-lg bg-slate-800 p-4"
                  >
                    <h5 className="mb-2 font-medium text-yellow-400">
                      {province.province}
                    </h5>
                    <div className="space-y-2">
                      {province.dealers.map((dealer) => (
                        <div key={dealer.id} className="text-sm">
                          <div className="font-medium">{dealer.name}</div>
                          <div className="text-gray-400">{dealer.address}</div>
                          <div className="text-blue-300">{dealer.phone}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-green-400">
                Khu Vực Miền Nam
              </h4>
              <div className="space-y-4">
                {southernDealers.map((province) => (
                  <div
                    key={province.id}
                    className="rounded-lg bg-slate-800 p-4"
                  >
                    <h5 className="mb-2 font-medium text-yellow-400">
                      {province.province}
                    </h5>
                    <div className="space-y-2">
                      {province.dealers.map((dealer) => (
                        <div key={dealer.id} className="text-sm">
                          <div className="font-medium">{dealer.name}</div>
                          <div className="text-gray-400">{dealer.address}</div>
                          <div className="text-blue-300">{dealer.phone}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        <hr className="mb-6 border-gray-700" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p>&copy; 2025 Lan Chuyên Hàng Sale. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
