import Link from "next/link";
import { BRAND, ROUTES } from "@/core/constants";

const FOOTER_LINKS = [
  { href: ROUTES.USER.HOME, label: "Trang chủ" },
  { href: ROUTES.USER.PRODUCTS, label: "Sản phẩm" },
  { href: ROUTES.USER.ABOUT, label: "Giới thiệu" },
  { href: ROUTES.USER.CONTACT, label: "Liên hệ" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Company Info */}
          <div className="lg:col-span-8">
            <h3 className="mb-4 text-xl font-bold text-blue-400 tracking-wider">
              {BRAND.name}
            </h3>
            <p className="mb-3 text-sm text-gray-300 italic">
              "{BRAND.slogan}"
            </p>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xl">
              {BRAND.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4">
            <h4 className="mb-4 text-lg font-semibold text-blue-400">
              Liên kết nhanh
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-gray-300 transition-colors hover:text-blue-400 hover:translate-x-1 transition-transform duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="mb-6 border-gray-700" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
