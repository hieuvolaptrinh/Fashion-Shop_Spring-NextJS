/**
 * Biểu thức chính quy (Regular Expressions) dùng chung cho toàn bộ dự án Fashion Shop
 */
export const REGEX_PATTERNS = {
  /**
   * Số điện thoại Việt Nam chuẩn:
   * - Hỗ trợ các định dạng: 0x, 84x hoặc +84x
   * - Đầu số di động hợp lệ: 3, 5, 7, 8, 9
   * - Theo sau bởi đúng 8 chữ số (độ dài 10 số đối với đầu 0)
   */
  PHONE_VN: /^(?:(?:\+84|84|0)[35789])\d{8}$/,

  /**
   * Định dạng địa chỉ Email tiêu chuẩn
   */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
